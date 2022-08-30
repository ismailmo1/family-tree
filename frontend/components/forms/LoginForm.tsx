import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";

const LoginForm = () => {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  const { user, signin } = useAuth();

  const loginUserHandler = () => {
    signin(usernameInput, passwordInput);
  };

  if (user) {
    const text = `Already Logged in as ${user?.name}`;
    return <Center>{text}</Center>;
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
