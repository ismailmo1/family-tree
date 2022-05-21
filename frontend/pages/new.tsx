import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { PersonMatchResult } from "../types/person";

const New: NextPage = () => {
  const personName = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  const renderToastContent = (id: string, name: string) => (
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
  );

  const addPerson = useCallback(async () => {
    setIsAdding(true);
    const res = await fetch(
      `http://localhost:8000/people/?name=${personName.current?.value}`,
      { method: "POST" }
    );
    const data: PersonMatchResult = await res.json();

    toast({
      render: () => renderToastContent(data.id, data.name),
      isClosable: true,
    });
    setIsAdding(false);
  }, []);

  return (
    <>
      <Center py="10">
        <Heading>Add Person</Heading>
      </Center>
      <Container minWidth={"60%"}>
        <FormControl>
          <FormLabel htmlFor="name">Enter person's name</FormLabel>
          <Input id="name" ref={personName} />
          <Center py="5">
            <Button onClick={addPerson}>
              {isAdding ? "Adding" : "Add Person"}
            </Button>
          </Center>
        </FormControl>
      </Container>
    </>
  );
};

export default New;
