import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { PersonMatchResult } from "../../types/person";

const PersonCard: React.FC<PersonMatchResult> = ({ name, id }) => {
  return (
    <Box id={id} p={10} bgColor="#B4CFB0" width={"100%"} rounded="lg">
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
