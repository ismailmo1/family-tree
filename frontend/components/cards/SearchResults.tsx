import { Container, Text, VStack } from "@chakra-ui/react";
import { PersonMatchResult } from "../../types/person";
import PersonCard from "./PersonCard";
interface SearchResultProps {
  personMatches: PersonMatchResult[];
}

const SearchResults: React.FC<SearchResultProps> = ({ personMatches }) => {
  if (personMatches.length > 0) {
    const personCards = personMatches.map((person) => (
      <PersonCard id={person.id} name={person.name} />
    ));

    return (
      <Container minWidth={"60%"} py={5}>
        <VStack>{personCards}</VStack>
      </Container>
    );
  } else {
    return (
      <Container minWidth={"60%"} py={5}>
        <VStack>
          <Text>No Matches found</Text>
        </VStack>
      </Container>
    );
  }
};

export default SearchResults;
