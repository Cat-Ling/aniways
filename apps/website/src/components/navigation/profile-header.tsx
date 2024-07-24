import { useAuth } from "@aniways/auth/react";
import { Image } from "@aniways/ui/aniways-image";
import { Skeleton } from "@aniways/ui/skeleton";

export const ProfileHeader = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="size-12 rounded-full" />;
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
      />
      <span className="text-lg font-bold">{user.name}</span>
    </div>
  );
};
