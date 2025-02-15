"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { toast } from "sonner";
import { getUsers } from "./actions";
import { ResolveMentionSuggestionsArgs, ResolveUsersArgs } from "@liveblocks/client";

type User = {
  id: string;
  name: string;
  avatar: string;
}

export function Room({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const params = useParams()

  const fetchUsers = useMemo(() => async () => {
    try {
      const list = await getUsers()
      setUsers(list)
    } catch {
      toast.error("Failed to fetch users")
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const resolveUsers = ({ userIds }: ResolveUsersArgs) => {
    return userIds.map((id) => users.find((user) => user.id === id)) ?? undefined
  }

  const resolveMentionSuggestions = ({ text }: ResolveMentionSuggestionsArgs) => {
    let filteredUsers = users;

    if (text) {
      filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase())
      );
    }

    return filteredUsers.map(user => user.id)
  }

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
      resolveRoomsInfo={() => []}
    >
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}