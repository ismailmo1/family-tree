import { Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { NuclearFamily } from "../../types/family";
import PersonCard from "./PersonCard";
const FamilyTree: React.FC<{ family: NuclearFamily }> = ({ family }) => {
  console.log(family.parents);

  const parentCards = (
    <>
      <Heading>Parents</Heading>
      <HStack>
        {family.parents.length > 0 ? (
          family.parents.map((parent) => {
            return <PersonCard name={parent.name} id={parent.id} />;
          })
        ) : (
          <Text>No Parents Found :(</Text>
        )}
      </HStack>
    </>
  );

  const siblingCards = (
    <>
      <Heading>Children</Heading>
      <HStack>
        {family.children.map((children) => {
          return <PersonCard name={children.name} id={children.id} />;
        })}
      </HStack>
    </>
  );

  return (
    <Container minWidth={"60%"} py={5}>
      <VStack>
        {parentCards}
        {siblingCards}
      </VStack>
    </Container>
  );
};

export default FamilyTree;
