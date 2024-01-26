'use client';

import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from '@animelist/auth-next/client';

export default function Home() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <pre>
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>
        <Button onClick={signOut}>Log Out</Button>
      </div>
    );
  }

  return <Button onClick={signIn}>Log In</Button>;
}
