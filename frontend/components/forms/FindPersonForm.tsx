import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { MouseEvent, useCallback, useRef, useState } from "react";
import { PersonMatchResult } from "../../types/person";

interface ClickableCard extends PersonMatchResult {
  onClick: (e: MouseEvent<HTMLElement>) => void;
}

interface FindFormProps {
  personCard: React.FC<PersonMatchResult | ClickableCard>;
  searchHeading?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

const FindForm: React.FC<FindFormProps> = ({
  personCard: PersonCard,
  searchHeading,
  onClick,
}) => {
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
    <PersonCard key={p.id} name={p.name} id={p.id} onClick={onClick} />
  ));
  const skeletonCard = (
    <Skeleton width="100%" rounded="lg">
      <PersonCard key="dummy" name="dummy" id="dummy" />
    </Skeleton>
  );

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="name">Full name</FormLabel>
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
          <>
            {peopleMatchCards.length > 0 && (
              <Text alignSelf="flex-start">{searchHeading}</Text>
            )}
            {peopleMatchCards}
          </>
        )}
      </VStack>
    </>
  );
};

export default FindForm;
