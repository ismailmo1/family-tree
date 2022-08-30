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
  username: string;
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
  authFetch: <FetchedResponse>(endpoint: string) => Promise<FetchedResponse>;
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
  let storedToken: string | null;
  if (typeof window !== "undefined") {
    // we are client side and have localStorage access
    storedToken = localStorage.getItem("accessToken");
    if (!accessToken && storedToken) {
      // e.g. we had a page refresh and lost context data
      // if we have stored token then add it to context
      // HACK is grabbing from context any better than from localStorage?
      // otherwise we dont need to store refreshToken and accessToken in context
      setAccessToken(storedToken);
    }
  }

  useEffect(() => {
    console.log("running useeffect");

    const getUser = async () => {
      try {
        // fetch api since useFetch doesnt allow changing headers
        // HACK: cant get provider to work for now :(
        const userData = await authFetch<UserDetailsResponse>(
          `${API_URL}/auth/users/me`
        );
        setUser(userData);
      } catch {
        console.log("user detail fetch failed");
      }
    };

    if (accessToken !== null) {
      console.log("getuser");

      getUser();
    }
  }, [accessToken]);

  const signin = async (username: string, password: string) => {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    const res = await loginRequest.post("/auth/token", data);
    setAccessToken(res.access_token);
    setRefreshToken(res.refresh_token);
    localStorage.setItem("accessToken", res.access_token);
    localStorage.setItem("refreshToken", res.refresh_token);
  };
  const signup = (username: string, password: string) => {};

  const signout = () => {
    console.log("signing out");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.setItem("accessToken", "null");
    localStorage.setItem("refreshToken", "null");
  };

  async function authFetch<FetchedResponse>(endpoint: string) {
    // authenticated fetching data
    // TODO add all error/success handling, refresh token logic etc. here
    if (!accessToken) {
      // e.g. we had a page refresh and lost context data
      // try get from localStorage

      // if we have stored token then add it to context
      if (storedToken) {
        // we have stored token in localstorage, but not in context
        console.log("grabbed stored token");

        setAccessToken(storedToken);
      } else {
        // user needs to login
        // we shouldn't be doing auth fetch without being logged in
        throw Error;
      }
    }

    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (res.ok) {
        const data: FetchedResponse = await res.json();
        console.log("fetch succeeded ");

        return data;
      } else {
        // force catch block execution
        console.dir(res);
        throw Error;
      }
    } catch {
      console.log(`fetch failed with token ${storedToken}`);
      throw Error;
    }
  }
  async function getNewAccessToken(refreshToken: string) {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`);
      if (res.statusText === "Token expired") {
        // user needs to login again
        console.log("refresh token expired");
        router.push("/login");
      } else {
        const data = await res.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);

      router.push("/login");
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
