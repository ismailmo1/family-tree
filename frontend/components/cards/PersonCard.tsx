import {
  Box,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useCallback, useState } from "react";
import { PersonMatchResult } from "../../types/person";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useAuth } from "../../hooks/use-auth";
import { API_URL } from "../../globals";
const PersonCard: React.FC<PersonMatchResult> = ({ name, id }) => {
  const [showFamilyOptions, setShowFamilyOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { authFetch } = useAuth();
  const deletePerson = useCallback(
    async (id: string) => {
      authFetch(`${API_URL}/people/?id=${id}`, { method: "DELETE" });
    },
    [authFetch]
  );
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
  const editOptions = (
    <>
      <IconButton
        bgColor="#B4CFB0"
        aria-label="edit-person"
        size="lg"
        icon={<DeleteIcon fontSize={"5xl"} />}
        onClick={() => deletePerson(id)}
      />
    </>
  );

  return (
    <Box id={id} p={10} bgColor="#B4CFB0" width={"100%"} rounded="lg">
      <VStack>
        <Box display={"flex"} justifyContent={"flex-end"}>
          <NextLink href={`/person/${id}`}>
            <Heading mb={4} size="lg" as="button">
              {name}
            </Heading>
          </NextLink>
          <IconButton
            bgColor="#B4CFB0"
            aria-label="edit-person"
            size="lg"
            icon={<EditIcon />}
            onClick={() => setIsEditing((prevState) => !prevState)}
          />
        </Box>
        <HStack>
          {/* show edit options if in edit mode */}
          {isEditing ? (
            editOptions
          ) : showFamilyOptions ? (
            familyOptions
          ) : (
            <>
              <NextLink href={`/parents/${id}`}>👨‍💼🙎🏻‍♀️ Parents</NextLink>
              <Text>|</Text>
              <NextLink href={`/siblings/${id}`}>🧑‍🤝‍🧑 Siblings</NextLink>
              <Text>|</Text>
              <NextLink href={`/spouse/${id}`}>❤️ Spouse</NextLink>
              <Text>|</Text>
              <Text cursor="pointer" onClick={() => setShowFamilyOptions(true)}>
                👨‍👩‍👦‍👦 Family
              </Text>
            </>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default PersonCard;
