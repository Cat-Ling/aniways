import { auth } from "@/server/auth";
import { cookies } from "next/headers";

type AuthenticatedProps = {
  authenticatedElement?: () => Promise<JSX.Element> | JSX.Element;
  unauthenticatedElement?: () => Promise<JSX.Element> | JSX.Element;
};

const Authenticated = async ({
  authenticatedElement: Element,
  unauthenticatedElement: UnauthenticatedElement,
}: AuthenticatedProps) => {
  const session = await auth(await cookies());

  if (session) {
    if (!Element) return null;
    return <Element />;
  }

  if (!UnauthenticatedElement) return null;
  return <UnauthenticatedElement />;
};

export default Authenticated;
