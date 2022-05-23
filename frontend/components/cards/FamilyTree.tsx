import {
  Center,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { NuclearFamily } from "../../types/family";
import SimplePersonCard from "./SimplePersonCard";
const FamilyTree: React.FC<{ family: NuclearFamily }> = ({ family }) => {
  const parentCards = (
    <>
      <Heading>Parents</Heading>
      <HStack>
        {family.parents.length > 0 ? (
          family.parents.map((parent) => {
            return (
              <SimplePersonCard
                key={parent.id}
                name={parent.name}
                id={parent.id}
              />
            );
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
      <Wrap spacing="10px" align="center" justify="center">
        {family.children.map((children) => {
          return (
            <WrapItem key={children.id}>
              <Center>
                <SimplePersonCard name={children.name} id={children.id} />
              </Center>
            </WrapItem>
          );
        })}
      </Wrap>
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
