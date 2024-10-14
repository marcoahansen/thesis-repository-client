import { Navigate } from "react-router-dom";
import { Loading } from "@/components/loading";
import { useUserHook } from "@/hooks/user-hooks";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { me } = useUserHook();
  const { data: user, isLoading } = me();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
}
