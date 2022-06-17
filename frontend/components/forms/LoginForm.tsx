import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUser } from "../../hooks/useUser";

const LoginForm = () => {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  const { isLoggedIn, loginUser } = useUser();

  const loginUserHandler = () => {
    loginUser(usernameInput, passwordInput);
  };

  if (isLoggedIn) {
    return <Center>Already Logged In!</Center>;
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
        <Button onClick={loginUserHandler}>Login</Button>
      </Center>
    </FormControl>
  );
};

export default LoginForm;
