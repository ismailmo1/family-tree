import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFetch } from "use-http";

interface JWTResponse {
  access_token: string;
  token_type: string;
}
const LoginForm = () => {
  const { loading, error, response, request } = useFetch<JWTResponse>(
    "http://localhost:8000"
  );
  const loginUser = async () => {
    const res = await request.post("/auth/token", {
      username: "user1",
      password: "secret",
    });
    console.log(res.access_token);

    return res.access_token;
  };
  return (
    <FormControl>
      <FormLabel htmlFor="username">Username</FormLabel>
      <Input id="username" />
      <FormLabel htmlFor="passord">Password</FormLabel>
      <Input id="password" type="password" />
      <Center py="5">
        <Button onSubmit={loginUser}>Login</Button>
      </Center>
    </FormControl>
  );
};

export default LoginForm;
