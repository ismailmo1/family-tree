import { ToastId, useToast, UseToastOptions } from "@chakra-ui/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useFetch, { Provider } from "use-http";
import { API_URL } from "../globals";

interface JWTResponse {
  username: string;
  access_token: string;
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

export const useUser = () => {
  let initialToken = null;
  let initialUsername = null;

  // make sure we are browser side and have localStorage access
  if (typeof window !== "undefined") {
    initialToken = localStorage.getItem("token");
    initialUsername = localStorage.getItem("username");
  }
  const [token, setToken] = useState(initialToken);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [username, setUsername] = useState(initialUsername);
  const toast = useToast();
  const { response, request } = useFetch<JWTResponse>(API_URL);
  const errorToastIdRef = useRef<ToastId>();

  const loginUser = async (username: string, password: string) => {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    const res = await request.post("/auth/token", data);
    localStorage.setItem("token", res.access_token);

    setToken(res.access_token);
    setIsLoggedIn(true);

    toast(successToastOptions);
  };

  if (response.ok === false) {
    const errorToastOptions: UseToastOptions = {
      title: "Login Failed!",
      description: `${response.status}: ${response.statusText}`,
      status: "error",
      duration: 5000,
      isClosable: true,
    };
    if (errorToastIdRef.current) {
      toast.update(errorToastIdRef.current, errorToastOptions);
    } else {
      errorToastIdRef.current = toast(errorToastOptions);
    }
  }

  return { isLoggedIn, token, loginUser, username };
};

interface AuthCtxInterface {
  user: UserDetailsResponse | null;
  token: string | null;
  signin: (username: string, password: string) => void;
  signup: (username: string, password: string) => void;
  signout: () => void;
}

const authContext = createContext({} as AuthCtxInterface);
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().

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
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetailsResponse | null>(null);
  const { request: loginRequest } = useFetch<JWTResponse>(API_URL);

  useEffect(() => {
    const getUser = async () => {
      try {
        // fetch api since useFetch doesnt allow changing headers
        // HACK: cant get provider to work for now :(
        const res = await fetch(`${API_URL}/auth/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData: UserDetailsResponse = await res.json();
        setUser(userData);
      } catch {
        console.log("user detail fetch failed");
      }
    };

    if (token !== null) {
      getUser();
    }
  }, [token]);

  const signin = async (username: string, password: string) => {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    const res = await loginRequest.post("/auth/token", data);
    setToken(res.access_token);
  };
  const signup = (username: string, password: string) => {};

  const signout = () => {
    console.log("signing out");

    setToken(null);
    setUser(null);
  };

  // Return the user object and auth methods

  return {
    user,
    token,
    signin,
    signup,
    signout,
  };
}
