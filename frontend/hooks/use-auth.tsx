import { ToastId, useToast, UseToastOptions } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useFetch, { Provider, UseFetchArgsReturn } from "use-http";
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

const successToastOptions: UseToastOptions = {
  title: "logged in!",
  status: "success",
  duration: 5000,
  isClosable: true,
};

interface AuthCtxInterface {
  user: UserDetailsResponse | null;
  token: string | null;
  signin: (username: string, password: string) => void;
  signup: (username: string, password: string) => void;
  signout: () => void;
  authFetch: <FetchedResponse>(
    endpoint: string
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
  const [user, setUser] = useState<UserDetailsResponse | null>(null);
  const { request: loginRequest } = useFetch<JWTResponse>(API_URL);
  const router = useRouter();
  let storedAccessToken: string | null;
  let storedRefreshToken: string | null;

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

  if (!user) {
    const getUser = async () => {
      try {
        // fetch api since useFetch doesnt allow changing headers
        // HACK: cant get provider to work for now :(
        const userData = await authFetch<UserDetailsResponse>(
          `${API_URL}/auth/users/me`
        );
        return userData;
      } catch {}
    };

    if (accessToken) {
      getUser().then((data) => {
        data && setUser(data);
      });
    }
  }

  const signin = async (username: string, password: string) => {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    const res = await loginRequest.post("/auth/token", data);
    setAccessToken(res.access_token);
    setRefreshToken(res.refresh_token);
    localStorage.setItem("accessToken", res.access_token);
    localStorage.setItem("refreshToken", res.refresh_token);
    router.push("/starter");
  };
  const signup = (username: string, password: string) => {};

  const signout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  async function authFetch<FetchedResponse>(endpoint: string) {
    // authenticated fetching data
    // TODO add all error/success handling, refresh token logic etc. here
    if (!accessToken || !refreshToken) {
      // stored tokens from localStorage should've populated these tokens
      // we shouldn't be doing auth fetch without being logged in
      // user needs to login before fetch
      signout();
      throw new Error("Not authenticated!");
    }

    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${storedAccessToken}` },
      });
      if (res.ok) {
        const data: FetchedResponse = await res.json();

        return data;
      }
      if (res.status == 401) {
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
          }
        }

        // repeat request
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        });
        if (res.ok) {
          const data: FetchedResponse = await res.json();

          return data;
        }
      }
    } catch {
      // some other fetch related error
      throw Error;
    }
  }
  async function getRefreshedTokens(refreshToken: string) {
    try {
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
      if (res.statusText === "Token expired") {
        // user needs to login again
        signout();
      } else {
        const data: JWTResponse = await res.json();
        return data;
      }
    } catch (error) {
      signout();
    }
  }

  // Return the user object and auth methods

  return {
    user,
    token: accessToken,
    authFetch,
    signin,
    signup,
    signout,
  };
}
