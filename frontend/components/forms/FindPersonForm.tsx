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
import { API_URL } from "../../globals";
import { useAuth } from "../../hooks/use-auth";
import { PersonMatchResult } from "../../types/person";

interface ClickableCard extends PersonMatchResult {
  onClick: (e: MouseEvent<HTMLElement>) => void;
  isLoading: boolean;
}

interface FindFormProps {
  personCard: React.FC<PersonMatchResult | ClickableCard>;
  searchHeading?: string;
  onClick?: (id: string) => void;
}

const FindForm: React.FC<FindFormProps> = ({
  personCard: PersonCard,
  searchHeading,
  onClick,
}) => {
  const personName = useRef<HTMLInputElement>(null);
  const [personMatches, setPersonMatches] = useState<PersonMatchResult[]>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [cardLoading, setCardLoading] = useState<boolean>(false);
  const { authFetch } = useAuth();
  const searchPerson = useCallback(async () => {
    setIsFetching(true);

    try {
      const data = await authFetch<PersonMatchResult[]>(
        `${API_URL}/people/?name=${personName.current?.value}`
      );
      const peopleMatches: PersonMatchResult[] = data;
      setPersonMatches(peopleMatches);
    } catch (error) {
      console.log(error);
      return;
    }

    setIsFetching(false);
  }, []);

  const onCardClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      setCardLoading(true);
      const personId = e.currentTarget.id;
      onClick && onClick(personId);
    },
    [onClick]
  );

  const peopleMatchCards =
    personMatches &&
    personMatches.map((p) => (
      <PersonCard
        key={p.id}
        name={p.name}
        id={p.id}
        onClick={onCardClick}
        isLoading={cardLoading}
      />
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
            {peopleMatchCards && peopleMatchCards.length > 0 && (
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
