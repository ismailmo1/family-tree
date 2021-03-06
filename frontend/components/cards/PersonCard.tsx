import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { PersonMatchResult } from "../../types/person";

const PersonCard: React.FC<PersonMatchResult> = ({ name, id }) => {
  const [showFamilyOptions, setShowFamilyOptions] = useState(false);
  const siblingOptions = (
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
        β©οΈ
      </Text>
    </>
  );

  return (
    <Box id={id} p={10} bgColor="#B4CFB0" width={"100%"} rounded="lg">
      <VStack>
        <NextLink href={`/person/${id}`}>
          <Heading mb={4} size="lg" as="button">
            {name}
          </Heading>
        </NextLink>
        <HStack>
          {showFamilyOptions ? (
            siblingOptions
          ) : (
            <>
              <NextLink href={`/parents/${id}`}>π¨βπΌππ»ββοΈ Parents</NextLink>
              <Text>|</Text>
              <NextLink href={`/siblings/${id}`}>π§βπ€βπ§ Siblings</NextLink>
              <Text>|</Text>
              <NextLink href={`/spouse/${id}`}>β€οΈ Spouse</NextLink>
              <Text>|</Text>
              <Text cursor="pointer" onClick={() => setShowFamilyOptions(true)}>
                π¨βπ©βπ¦βπ¦ Family
              </Text>
            </>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default PersonCard;
