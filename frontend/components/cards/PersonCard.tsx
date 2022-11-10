import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { PersonMatchResult } from "../../types/person";

const PersonCard: React.FC<PersonMatchResult> = ({ name, id }) => {
  const [showFamilyOptions, setShowFamilyOptions] = useState(false);

  const familyOptions = (
    <>
      <NextLink href={`/family/${id}?perspective=parent`}>
        Spouse & Children
      </NextLink>
      <Text>|</Text>
      <NextLink href={`/family/${id}?perspective=child`}>
        Parents & Siblings
      </NextLink>
      <Text>|</Text>
      <Text cursor="pointer" onClick={() => setShowFamilyOptions(false)}>
        ↩️
      </Text>
    </>
  );

  return (
    <NextLink href={`/person/${id}`}>
      <Box id={id} p={10} bgColor="#B4CFB0" width={"100%"} rounded="lg">
        <VStack>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Heading mb={4} size="lg" as="button">
              {name}
            </Heading>
          </Box>
          <HStack>
            {showFamilyOptions ? (
              familyOptions
            ) : (
              <>
                <NextLink href={`/parents/${id}`}>👨‍💼🙎🏻‍♀️ Parents</NextLink>
                <Text>|</Text>
                <NextLink href={`/siblings/${id}`}>🧑‍🤝‍🧑 Siblings</NextLink>
                <Text>|</Text>
                <NextLink href={`/spouse/${id}`}>❤️ Spouse</NextLink>
                <Text>|</Text>
                <NextLink href={`/children/${id}`}>👨‍👩‍👦‍👦 Children</NextLink>
                <Text>|</Text>
                <Text
                  cursor="pointer"
                  onClick={() => setShowFamilyOptions(true)}
                >
                  🌳 Tree
                </Text>
              </>
            )}
          </HStack>
        </VStack>
      </Box>
    </NextLink>
  );
};

export default PersonCard;
