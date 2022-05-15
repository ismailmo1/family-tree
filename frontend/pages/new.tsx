import {
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
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { PersonMatchResult } from "../types/person";
const New: NextPage = () => {
  const personName = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const toast = useToast();

  const addPerson = useCallback(async () => {
    setIsAdding(true);
    const res = await fetch(
      `http://localhost:8000/people/?name=${personName.current?.value}`,
      { method: "POST" }
    );
    const data: PersonMatchResult = await res.json();
    const toastContent = () => (
      <Link href={`/person/${data.id}`}>Go to Page</Link>
    );
    toast({ render: toastContent, isClosable: true });
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
