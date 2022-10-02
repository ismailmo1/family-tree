import { ToastId, useToast, UseToastOptions } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { API_URL } from "../globals";

interface JWTResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
interface UserDetailsResponse {
  username: string;
  hashed_password: string;
  name: string;
  id: string;
}

interface AuthCtxInterface {
  user: UserDetailsResponse | null;
  token: string | null;
  signin: (username: string, password: string) => void;
  signup: (username: string, password: string, inviteToken: string) => void;
  signout: () => void;
  isFetching: boolean;
  authFetch: <FetchedResponse>(
    endpoint: string,
    fetchOptions?: RequestInit
  ) => Promise<FetchedResponse | undefined>;
}

const authContext = createContext({} as AuthCtxInterface);
// Provider component that wraps your app and makes auth object
// available to any child component that calls useAuth().

interface ProvideAuthProps {
  children: ReactNode;
}

export function ProvideAuth(props: ProvideAuthProps) {
  // auth context provider

  const auth = useProvideAuth();

  return (
    <authContext.Provider value={auth}>{props.children}</authContext.Provider>
  );
}
// Hook for child components to get the auth object
// and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [user, setUser] = useState<UserDetailsResponse | null>(null);
  const router = useRouter();
  const toast = useToast();
  let storedAccessToken: string | null = null;
  let storedRefreshToken: string | null = null;
  console.log("running useAuth");

  if (typeof window !== "undefined") {
    // we are client side and have localStorage access
    storedAccessToken = localStorage.getItem("accessToken");
    storedRefreshToken = localStorage.getItem("refreshToken");
    if (
      (!accessToken && storedAccessToken) ||
      (!refreshToken && storedRefreshToken)
    ) {
      // e.g. we had a page refresh and lost context data
      // if we have stored tokens then add them to context
      // HACK is grabbing from context any better than from localStorage?
      // otherwise we dont need to store refreshToken and accessToken in context
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    }
  }

  const signin = async (username: string, password: string) => {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    // setIsFetching(true);
    const res = await fetch(API_URL + "/auth/token", {
      method: "POST",
      body: data,
    });
    // setIsFetching(false);

    if (res.status === 200) {
      const resData: JWTResponse = await res.json();
      setAccessToken(resData.access_token);
      setRefreshToken(resData.refresh_token);
      localStorage.setItem("accessToken", resData.access_token);
      localStorage.setItem("refreshToken", resData.refresh_token);
      router.push("/starter");
      !toast.isActive("loginSuccess") &&
        toast({
          id: "loginSuccess",
          title: `Login Success!`,
          description: `Welcome back`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
    } else {
      router.push("/login");
      !toast.isActive("failedLogin") &&
        toast({
          id: "failedLogin",
          title: `Failed login`,
          description: `Try sign in again`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
    }
  };
  const signup = async (
    username: string,
    password: string,
    inviteToken: string
  ) => {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("invite_token", inviteToken);
    // setIsFetching(true);
    const res = await fetch(API_URL + "/auth/signup", {
      method: "POST",
      body: data,
    });
  };

  const signout = useCallback(
    (showToast: boolean = true) => {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/login");
      showToast &&
        !toast.isActive("logoutSuccess") &&
        toast({
          id: "logoutSuccess",
          title: `Logout Success!`,
          description: `Bye!`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
    },
    [router, toast]
  );
  const getRefreshedTokens = useCallback(
    async function getRefreshedTokens(refreshToken: string) {
      if (!refreshToken) return;
      try {
        // setIsFetching(true);

        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: "bearer",
          }),
        });
        // setIsFetching(false);

        if (res.status === 401) {
          // user needs to login again
          // refresh token expired
          signout();
          return;
        }
        if (res.status === 200) {
          // our tokens got refreshed
          const data: JWTResponse = await res.json();
          return data;
        }
      } catch (error) {
        // something else went wrong with our request
        signout();
        return;
      }
    },
    [accessToken, signout]
  );
  const authFetch = useCallback(
    async function authFetchFunc<FetchedResponse>(
      endpoint: string,
      fetchOptions?: RequestInit
    ) {
      // authenticated fetching data
      // TODO add all error/success handling, refresh token logic etc. here
      if (!accessToken || !refreshToken) {
        // stored tokens from localStorage should've populated these tokens
        // we shouldn't be doing auth fetch without being logged in
        // user needs to login before fetch
        signout(false);
        console.log(endpoint + " failed");

        !toast.isActive("unauthorised") &&
          toast({
            id: "unauthorised",
            title: `Unauthorised`,
            description: "Login to view that page",
            status: "warning",
            duration: 2000,
            isClosable: true,
          });
        router.push("/login");
        return;
      }

      try {
        // we have access token and refresh token
        setIsFetching(true);

        const res = await fetch(endpoint, {
          ...fetchOptions,
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        });
        setIsFetching(false);

        if (res.ok) {
          const data: FetchedResponse = await res.json();

          return data;
        }
        if (res.status === 401) {
          // access token didnt work
          // lets try get a new one with our refreshtoken
          if (refreshToken) {
            const refreshedTokenData = await getRefreshedTokens(refreshToken);
            if (refreshedTokenData) {
              const {
                access_token: refreshedAccessToken,
                refresh_token: refreshedRefreshToken,
              } = refreshedTokenData;

              // update all the tokens
              setRefreshToken(refreshedRefreshToken);
              setAccessToken(refreshedAccessToken);
              localStorage.setItem("accessToken", refreshedAccessToken);
              localStorage.setItem("refreshToken", refreshedRefreshToken);
              // repeat request
              setIsFetching(true);

              const res = await fetch(endpoint, {
                ...fetchOptions,
                headers: { Authorization: `Bearer ${storedAccessToken}` },
              });
              setIsFetching(false);

              if (res.ok) {
                const data: FetchedResponse = await res.json();

                return data;
              }
            }
          }

          if (res.status === 401) {
            // our refresh token expired
            signout(false);
            !toast.isActive("expiredRefresh") &&
              toast({
                id: "expiredRefresh",
                title: `Try Log in again!`,
                description: `Enter credentials`,
                status: "warning",
                duration: 2000,
                isClosable: true,
              });
            router.push("/login");
          }
        }
      } catch {
        // some other fetch related error
        setIsFetching(false);
        !toast.isActive("serverError") &&
          toast({
            id: "serverError",
            title: `Something went wrong`,
            description: `Sorry!`,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
      }
    },
    [
      accessToken,
      refreshToken,
      getRefreshedTokens,
      router,
      signout,
      storedAccessToken,
      toast,
    ]
  );

  useEffect(() => {
    if (!user) {
      const getUser = async () => {
        try {
          const userData = await authFetch<UserDetailsResponse>(
            `${API_URL}/auth/users/me`
          );
          return userData;
        } catch (e) {
          console.log(e);
          signout(false);
          !toast.isActive("notLoggedIn") &&
            toast({
              id: "notLoggedIn",
              title: `You must be logged in!`,
              description: `Enter credentials`,
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          router.push("/login");
        }
      };

      if (accessToken) {
        getUser().then((data) => {
          console.log("grabbing user" + data);
          data && setUser(data);
        });
      }
    }
  }, [user, accessToken, authFetch, router, signout, toast]);

  // Return the user object and auth methods

  return {
    user,
    token: accessToken,
    authFetch,
    isFetching,
    signin,
    signup,
    signout,
  };
}
