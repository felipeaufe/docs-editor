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
import { getUsers, getDocuments } from "./actions";
import { ResolveMentionSuggestionsArgs, ResolveUsersArgs } from "@liveblocks/client";
import { Id } from "@/convex/_generated/dataModel";

import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins"

type User = {
  id: string;
  name: string;
  avatar: string;
  color: string;
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

  const authEndpoint = async () => {
    const endpoint = "/api/liveblocks-auth"
    const room = params.documentId as string

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ room }),
    })

    return response.json()
  }

  const resolveRoomsInfo = async ({ roomIds }: { roomIds: string[] }) => {
    return await getDocuments(roomIds as Id<"documents">[])
  }

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={authEndpoint}
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
      resolveRoomsInfo={resolveRoomsInfo}
    >
      <RoomProvider
        id={params.documentId as string}
        initialStorage={{
          leftMargin: LEFT_MARGIN_DEFAULT,
          rightMargin: RIGHT_MARGIN_DEFAULT
        }}
      >
        <ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}