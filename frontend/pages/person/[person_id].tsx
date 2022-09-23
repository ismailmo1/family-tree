import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import SearchResults from "../../components/cards/SearchResults";
import { API_URL } from "../../globals";
import { useAuth } from "../../hooks/use-auth";
import { PersonMatchResult } from "../../types/person";

const PersonPage: NextPage = () => {
  const router = useRouter();
  const personId = router.query.person_id as string;
  const [personDetails, setPersonDetails] = useState<PersonMatchResult[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authFetch } = useAuth();
  useEffect(() => {
    if (!personId) {
      return;
    }

    const fetchPersonDetails = async () => {
      await authFetch<PersonMatchResult[]>(
        `${API_URL}/people/?id=${personId}`
      ).then((data) => {
        setPersonDetails(data);
      });
    };
    fetchPersonDetails();
  }, [personId, authFetch]);

  const deletePerson = useCallback(
    async (id: string | undefined) => {
      id && authFetch(`${API_URL}/people/?id=${id}`, { method: "DELETE" });
    },
    [authFetch]
  );

  const deleteConfirmModal = (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text size={"lg"}>
            Are you sure you want to remove {personDetails?.at(0)?.name} and all
            associated relationships?
          </Text>
        </ModalBody>
        <ModalFooter display={"flex"} justifyContent={"space-around"}>
          <Button
            aria-label="delete-person"
            colorScheme={"red"}
            onClick={() => deletePerson(personId)}
          >
            Delete
          </Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  const userStats = (
    <HStack marginY={"20px"}>
      <Stat>
        <StatLabel>Total Siblings</StatLabel>
        <StatNumber>
          N/A
          {/* {personDetails?.at(0)?.age || "N/A"} */}
        </StatNumber>
        <StatHelpText># Brothers and # Sisters</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Total Children</StatLabel>
        <StatNumber>
          N/A
          {/* {personDetails?.at(0)?.childrenCount || "N/A"} */}
        </StatNumber>
        <StatHelpText># Sons and # Daughters</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Total 1st Cousins</StatLabel>
        <StatNumber>
          N/A
          {/* {personDetails?.at(0)?.firstCousinCount || "N/A"} */}
        </StatNumber>
        <StatHelpText> # Mum | # Dad </StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Total Aunts/Uncles</StatLabel>
        <StatNumber>
          N/A
          {/* {personDetails?.at(0)?.age || "N/A"} */}
        </StatNumber>
        <StatHelpText># Uncles and # Aunts</StatHelpText>
      </Stat>
    </HStack>
  );
  return (
    <>
      <Heading>Details</Heading>
      {personDetails && (
        <>
          <SearchResults personMatches={personDetails} />
          {userStats}
          <Button
            aria-label="delete-person"
            size="lg"
            colorScheme={"red"}
            onClick={() => onOpen()}
          >
            Delete
          </Button>
          {deleteConfirmModal}
        </>
      )}
    </>
  );
};

export default PersonPage;
