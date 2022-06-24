import { ToastId, useToast, UseToastOptions } from "@chakra-ui/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useFetch from "use-http";
import { API_URL } from "../globals";

interface JWTResponse {
  username: string;
  access_token: string;
  token_type: string;
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
  user: string | null;
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
  const { response, request } = useFetch<JWTResponse>(API_URL);

  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const signin = async (username: string, password: string) => {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    const res = await request.post("/auth/token", data);
    setUser(res.username);
    setToken(res.access_token);
  };
  const signup = (username: string, password: string) => {};

  const signout = () => {
    setToken(null);
    setUser(null);
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {}, []);
  // Return the user object and auth methods
  return {
    user,
    token,
    signin,
    signup,
    signout,
  };
}
