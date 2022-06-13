import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  ToastId,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useFetch } from "use-http";
import { API_URL } from "../../globals";

interface JWTResponse {
  access_token: string;
  token_type: string;
}
const LoginForm = () => {
  const toast = useToast();
  const errorToastIdRef = useRef<ToastId>();
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const { loading, error, response, request } = useFetch<JWTResponse>(API_URL);
  const loginUser = async () => {
    const data = new FormData();
    data.append("username", usernameInput);
    data.append("password", passwordInput);
    const res = await request.post("/auth/token", data);
    console.log(res.access_token);
    const successToastOptions: UseToastOptions = {
      title: "logged in!",
      status: "success",
      duration: 5000,
      isClosable: true,
    };
    toast(successToastOptions);
    // return res.access_token;
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

  if (loading) {
    return <Spinner size={"xl"} />;
  }

  return (
    <FormControl>
      <FormLabel htmlFor="username">Username</FormLabel>
      <Input id="username" onChange={(e) => setUsernameInput(e.target.value)} />
      <FormLabel htmlFor="password">Password</FormLabel>
      <Input
        id="password"
        type="password"
        onChange={(e) => setPasswordInput(e.target.value)}
      />
      <Center py="5">
        <Button onClick={loginUser}>Login</Button>
      </Center>
    </FormControl>
  );
};

export default LoginForm;
