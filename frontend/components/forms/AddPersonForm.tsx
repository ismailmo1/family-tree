import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { API_URL } from "../../globals";
import { useAuth } from "../../hooks/use-auth";
import { PersonMatchResult } from "../../types/person";

const CreatePersonForm: React.FC<{ onAddPerson?: (id: string) => void }> = ({
  onAddPerson,
}) => {
  const personName = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();
  const { authFetch } = useAuth();
  const renderToastContent = useCallback(
    (id: string, name: string) => (
      <Alert
        status="success"
        as="button"
        onClick={() => router.push(`/person/${id}`)}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <AlertIcon />
        <AlertTitle>{name} added successfully!</AlertTitle>
        <AlertDescription>
          Click me to go to their page to add relationships
        </AlertDescription>
      </Alert>
    ),
    [router]
  );

  const addPerson = useCallback(async () => {
    if (!personName.current) {
      return;
    }
    setIsAdding(true);
    const data = await authFetch<PersonMatchResult>(
      `${API_URL}/people/?name=${personName.current.value}`,
      { method: "POST" }
    );

    data &&
      toast({
        render: () => renderToastContent(data.id, data.name),
        isClosable: true,
      });
    setIsAdding(false);
    onAddPerson && data && onAddPerson(data.id);
  }, [onAddPerson, renderToastContent, toast]);

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="name">{"Enter person's name"}</FormLabel>
        <Input id="name" ref={personName} />
        <Center py="5">
          <Button onClick={addPerson}>
            {isAdding ? "Adding" : "Add Person"}
          </Button>
        </Center>
      </FormControl>
    </>
  );
};

export default CreatePersonForm;
