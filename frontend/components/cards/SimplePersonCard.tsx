import { Box, Heading, LinkBox, LinkOverlay, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { PersonMatchResult } from "../../types/person";

const PersonCard: React.FC<PersonMatchResult> = ({ name, id }) => {
  return (
    <LinkBox>
      <NextLink href={`/person/${id}`} passHref>
        <LinkOverlay>
          <Box id={id} p={10} bgColor="#B4CFB0" width={"100%"} rounded="lg">
            <VStack>
              <Heading mb={4} size="lg" as="button">
                {name}
              </Heading>
            </VStack>
          </Box>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
};

export default PersonCard;
