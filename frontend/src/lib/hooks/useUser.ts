import { User } from "@/lib/types/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export function useUser() {
  const { data: session } = useSession();

  const fetcher = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
        headers: { Authorization: "Bearer " + session?.access_token },
      })
      .then((res) => res.data);

  const { data, error, isLoading, mutate } = useSWR<User>(
    session ? `api/auth/user/` : null,
    fetcher,
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}
