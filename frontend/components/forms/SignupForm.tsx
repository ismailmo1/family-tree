import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL } from "../../globals";
import { useAuth } from "../../hooks/use-auth";
interface InviteTokenData {
  source_user_id: string;
  target_user_id: string;
}
const SignupForm = () => {
  const [usernameInput, setUsernameInput] = useState<string>();
  const [passwordInput, setPasswordInput] = useState<string>();
  const [invitedUser, setInvitedUser] = useState<string>();
  const [sourceUser, setSourceUser] = useState<string>();
  const router = useRouter();
  const inviteToken = router.query.invite as string;
  const { user, signup, isFetching } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const validateToken = async () => {
      const res = await fetch(`${API_URL}/auth/signup?invite=${inviteToken}`);
      if (res.status === 200) {
        const data: InviteTokenData = await res.json();
        setInvitedUser(data.target_user_id);
        setSourceUser(data.source_user_id);
      }
      !toast.isActive("inviteFail") &&
        toast({
          id: "inviteFail",
          title: `Invalid Invite Link!`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      router.push("/");
      return;
    };
    validateToken();
  }, [inviteToken, router, toast]);

  const signupHandler = () => {
    if (usernameInput && passwordInput && inviteToken) {
      signup(usernameInput, passwordInput, inviteToken);
    }
  };

  if (user) {
    const text = `Already Logged in as ${user.name}`;
    return <Center>{text}</Center>;
  }

  return (
    <>
      <Heading mb={"10px"}>Validating invite link</Heading>
      <Spinner />
      {invitedUser && sourceUser && (
        <>
          <Heading>Register</Heading>
          <Heading size={"md"}>
            Welcome {invitedUser}, {sourceUser} invited you to join Family Tree!
          </Heading>

          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <Center py="5">
              <Button onClick={signupHandler}>
                Register {isFetching && <Spinner />}
              </Button>
            </Center>
          </FormControl>
        </>
      )}
    </>
  );
};

export default SignupForm;
