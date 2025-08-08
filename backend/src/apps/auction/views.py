from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse
from datetime import datetime, timezone

from src.apps.auction.models import Bid, Auction
from src.apps.auction.serializers import EmptyAuctionSerializer, BidSerializer, AuctionSerializer, BidListSerializer, \
    UserEditSerializer, UserIdSerializer, UserBidAuctionsSerializer
from src.apps.auction.consts import BID_INCREMENT


class DeadlinePermissions(BasePermission):
    def has_permission(self, request, *args, **kwargs):
        if request.method == "GET":
            return request.user
        deadline = datetime(2024, 12, 22, 19, 30, tzinfo=timezone.utc)
        return request.user and datetime.now(timezone.utc) < deadline


class AuctionViewSet(
    viewsets.GenericViewSet,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin
):
    permission_classes = (DeadlinePermissions,)
    serializer_class = EmptyAuctionSerializer

    def get_queryset(self):
        if self.request.method == 'GET':
            return Auction.objects.all()
        user = self.request.user
        return Auction.objects.filter(user=user)

    def create(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(status=status.HTTP_201_CREATED)

    @action(url_path='list', detail=False)
    def get_all_auctions(self, request):
        auctions = Auction.objects.select_related('user').prefetch_related('bid_set').order_by('-id')
        bids = Bid.objects.select_related('user')
        results_data = []

        for auction in auctions:
            top_bid = bids.filter(auction=auction).order_by('-value').first()
            top_bidder = top_bid.user if top_bid else None

            results_data.append({
                "id": auction.id,
                "title": auction.title,
                "user": auction.user.id,
                "user_firstname": auction.user.first_name,
                "user_lastname": auction.user.last_name,
                "description": auction.description,
                "photo_url": auction.photo_url,
                "deadline": auction.deadline,
                "min_bid_value": auction.min_bid_value,
                "auction_end_data": auction.auction_end_data,
                "is_paid": auction.is_paid,
                "is_collected": auction.is_collected,
                "num_of_winners": auction.num_of_winners,
                'top_bid_value': top_bid.value if top_bid else None,
                'top_bidder_firstname': top_bidder.first_name if top_bidder else None,
                'top_bidder_lastname': top_bidder.last_name if top_bidder else None
            })

        serializer = AuctionSerializer(data=results_data, many=True)
        serializer.is_valid()
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(url_path='sum_of_winning_bids', detail=False, methods=["get"])
    def get_sum_of_wining_bids(self, request):
        auctions = Auction.objects.prefetch_related('bid_set').all()
        total_winning_sum = 0
        for auction in auctions:
            auction_bid_values = list(auction.bid_set.all().values_list("value", flat=True))
            auction_bid_values.sort(reverse=True)
            total_winning_sum += sum(auction_bid_values[:min(auction.num_of_winners, len(auction_bid_values))])
        return Response(status=status.HTTP_200_OK, data={"sum": total_winning_sum})

    @action(url_path='bids', detail=True)
    def get_all_bids(self, request, pk: int):
        auction = Auction.objects.get(pk=pk)
        serializer = BidListSerializer(data=auction.bid_set.order_by('-value'), many=True)
        serializer.is_valid()
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class BidViewSet(viewsets.GenericViewSet):
    permission_classes = (DeadlinePermissions,)
    serializer_class = BidSerializer

    def get_queryset(self):
        user = self.request.user
        return Bid.objects.filter(user=user)

    @extend_schema(
        responses={
            201: OpenApiResponse(response=UserIdSerializer, description="Created or udpated"),
            400: OpenApiResponse(description="Bid value is too low"),
            403: OpenApiResponse(description="The user cannot overbid their own bid if its the highest bid"),
            404: OpenApiResponse(description="No auction with given id")
        }
    )
    def create(self, request):
        auction_id, value = request.data["auction_id"], request.data["value"]
        try:
            auction = Auction.objects.get(id=auction_id)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = request.user

        # Only allow bid creation if this is first bid of the user in an offer
        # and it exceeds current leader by at least 10 (BID_INCREMENT in consts)
        if auction.bid_set.count() > 0:
            top_bid = auction.bid_set.all().order_by('-value').first()
            if top_bid.user == request.user:
                return Response(status=status.HTTP_403_FORBIDDEN)
            if top_bid.value + BID_INCREMENT > value:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            value_to_beat = auction.min_bid_value
            if value_to_beat is None:
                value_to_beat = BID_INCREMENT
            if value < value_to_beat:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        Bid.objects.update_or_create(
            user=user,
            auction=auction,
            defaults={'value': value}
        )
        return Response(status=status.HTTP_201_CREATED, data={'user_id': request.user.id})


class UserEditView(APIView):
    permission_classes = (DeadlinePermissions,)
    serializer_class = UserEditSerializer


    def post(self, request):
        serializer = UserEditSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.first_name = serializer.data['first_name']
        user.last_name = serializer.data['last_name']
        user.save()
        return Response(status=status.HTTP_200_OK)


class UserBidAuctionsViewSet(viewsets.GenericViewSet):
    permission_classes = (DeadlinePermissions, )
    serializer_class = UserBidAuctionsSerializer

    @action(url_path="all", detail=False, methods=["get"])
    def get_all_auctions(self, request):
        user_bid_auctions = Auction.objects.filter(bid__user=request.user)
        auction_ids = user_bid_auctions.values_list('id', flat=True)

        serializer = self.serializer_class(data={'auctions': auction_ids})
        serializer.is_valid()
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(url_path="winning", detail=False, methods=["get"])
    def get(self, request):
        user_bid_auctions = Auction.objects.filter(bid__user=request.user).prefetch_related('bid_set__user')
        bids_in_bid_auctions = Bid.objects.filter(auction__in=user_bid_auctions).select_related('user')

        winning_auctions = []
        for auction in user_bid_auctions:
            auction_bids = bids_in_bid_auctions.filter(auction=auction).order_by("-value")
            bids_user_ids = list(auction_bids.values_list("user__id", flat=True))
            if request.user.id not in bids_user_ids:
                continue
            bid_user_position = bids_user_ids.index(request.user.id)

            if bid_user_position < auction.num_of_winners:
                winning_auctions.append(auction.id)

        serializer = self.serializer_class(data={'auctions': winning_auctions})
        serializer.is_valid()
        return Response(status=status.HTTP_200_OK, data=serializer.data)

