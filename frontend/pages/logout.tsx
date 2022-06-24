import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../hooks/use-auth";

const Logout: NextPage = () => {
  const router = useRouter();
  const { signout } = useAuth();

  useEffect(() => {
    signout();
    router.push("/login");
  }, [router, signout]);
  return <></>;
};

export default Logout;
