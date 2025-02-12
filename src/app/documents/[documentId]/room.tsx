"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {

  const params = useParams()

  return (
    <LiveblocksProvider publicApiKey={"pk_dev_dSVb8ECEMLIiIuodskiYQA8NL4ea8U4hX3InD1Rb4Nd6Fw0kCEpOWYVnQZ_LpwBU"}>
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}