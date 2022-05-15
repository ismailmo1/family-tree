import { Container, VStack } from "@chakra-ui/react";
import { PersonMatchResult } from "../../types/person";
import PersonCard from "./PersonCard";
interface SearchResultProps {
  personMatches: PersonMatchResult[];
}

const SearchResults: React.FC<SearchResultProps> = ({ personMatches }) => {
  const personCards = personMatches.map((person) => (
    <PersonCard id={person.id} name={person.name} />
  ));

  return (
    <Container minWidth={"60%"} py={5}>
      <VStack>{personCards}</VStack>
    </Container>
  );
};

export default SearchResults;
