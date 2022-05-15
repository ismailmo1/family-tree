import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useCallback, useRef, useState } from "react";
import PersonCard from "../components/cards/PersonCard";
import { PersonMatchResult } from "../types/person";

const Find: NextPage = () => {
  const personName = useRef<HTMLInputElement>(null);
  const [personMatches, setPersonMatches] = useState<PersonMatchResult[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const searchPerson = useCallback(async () => {
    setIsFetching(true);
    const res: Response = await fetch(
      `http://localhost:8000/people/?name=${personName.current?.value}`
    );
    const peopleMatches: PersonMatchResult[] = await res.json();
    setPersonMatches(peopleMatches);
    setIsFetching(false);
  }, []);

  const peopleMatchCards = personMatches.map((p) => (
    <PersonCard key={p.id} name={p.name} id={p.id} />
  ));
  const skeletonCard = (
    <Skeleton width="100%">
      <PersonCard key="dummy" name="dummy" id="dummy" />
    </Skeleton>
  );

  return (
    <>
      <Center py="10">
        <Heading>Find</Heading>
      </Center>
      <Container minWidth={"60%"}>
        <FormControl>
          <FormLabel htmlFor="name">Enter your name</FormLabel>
          <Input id="name" ref={personName} />
          <Center py="5">
            <Button onClick={searchPerson}>
              {isFetching ? "Loading" : "Search"}
            </Button>
          </Center>
        </FormControl>

        <VStack>
          {isFetching ? (
            <>
              {skeletonCard}
              {skeletonCard}
            </>
          ) : (
            peopleMatchCards
          )}
        </VStack>
      </Container>
    </>
  );
};

export default Find;
