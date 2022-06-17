import { ToastId, useToast, UseToastOptions } from "@chakra-ui/react";
import { useRef, useState } from "react";
import useFetch from "use-http";
import { API_URL } from "../globals";

interface JWTResponse {
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

  return { isLoggedIn, token, loginUser };
};
