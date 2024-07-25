import { Image } from "@aniways/ui/aniways-image";
import { Skeleton } from "@aniways/ui/skeleton";

import { api } from "../trpc";

export const ProfileHeader = () => {
  const { data: user, isLoading } = api.auth.getSession.useQuery();

  if (isLoading) {
    return <Skeleton className="size-8 w-1/2" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mb-3 flex items-center gap-2">
      <Image
        src={user.user.picture}
        width={32}
        height={32}
        className="size-8 rounded-full object-cover"
      />
      <span className="text-lg font-bold">{user.user.name}</span>
    </div>
  );
};
