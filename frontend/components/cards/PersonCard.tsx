import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

interface PersonCardProps {
  name: string;
  id: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ name, id }) => {
  return (
    <Box p={10} bgColor="#B4CFB0" width={"100%"} rounded="lg">
      <VStack>
        <Link href={`/person/${id}`}>
          <Heading mb={4} size="lg" as="button">
            {name}
          </Heading>
        </Link>
        <HStack>
          <Link href={`/siblings/${id}`}>🧑‍🤝‍🧑 Siblings</Link>
          <Text>|</Text>
          <Link href={`/parents/${id}`}>👨‍💼🙎🏻‍♀️ Parents</Link>
          <Text>|</Text>
          <Link href={`/family/${id}`}>👨‍👩‍👦‍👦 Family</Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PersonCard;
