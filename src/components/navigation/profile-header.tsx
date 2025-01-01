"use client";

import { useAuth } from "@/hooks/auth";
import { Skeleton } from "../ui/skeleton";
import { Image } from "../ui/image";

export const ProfileHeader = () => {
  const {
    session: { user, isLoading },
  } = useAuth();

  if (isLoading) {
    return <Skeleton className="size-8 w-1/2" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mb-3 flex items-center gap-2">
      <Image
        src={user.picture}
        width={32}
        height={32}
        className="size-8 rounded-full object-cover"
        alt={`Profile picture of ${user.name}`}
      />
      <span className="text-lg font-bold">{user.name}</span>
    </div>
  );
};
