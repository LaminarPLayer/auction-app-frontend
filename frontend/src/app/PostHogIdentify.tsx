"use client";

import { useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function PostHogIdentify(): null {
  const posthog = usePostHog();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user && posthog) {
      posthog.identify(String(session.user.pk), {
        email: session.user.email,
        username: session.user.username,
      });
    } else if (status === "unauthenticated" && posthog) {
      posthog.reset(true); // Reset user identification and device ID on logout
    }
  }, [status, session, posthog]);

  return null;
}
