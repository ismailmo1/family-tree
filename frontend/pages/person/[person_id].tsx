import { CheckIcon, CopyIcon, DeleteIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
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
  Spinner,
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
  const [siblingCount, setSiblingCount] = useState<number>();
  const [childrenCount, setChildrenCount] = useState<number>();
  const [cousinCount, setCousinCount] = useState<number>();
  const [auncleCount, setAuncleCount] = useState<number>();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isInviteOpen,
    onOpen: onInviteOpen,
    onClose: onInviteClose,
  } = useDisclosure();
  const { authFetch, signout, user } = useAuth();
  useEffect(() => {
    if (!personId) {
      return;
    }

    const fetchPersonDetails = async () => {
      console.log("fetching details");

      authFetch<PersonMatchResult[]>(`${API_URL}/people/?id=${personId}`).then(
        (data) => {
          setPersonDetails(data);
        }
      );
      authFetch<PersonMatchResult[]>(
        `${API_URL}/family/siblings?id=${personId}`
      ).then((data) => {
        setSiblingCount(data?.length);
      });
      authFetch<PersonMatchResult[]>(
        `${API_URL}/family/piblings?id=${personId}`
      ).then((data) => {
        setAuncleCount(data?.length);
      });
      authFetch<PersonMatchResult[]>(
        `${API_URL}/family/cousins?id=${personId}`
      ).then((data) => {
        setCousinCount(data?.length);
      });
      authFetch<PersonMatchResult[]>(`${API_URL}/children?id=${personId}`).then(
        (data) => {
          setChildrenCount(data?.length);
        }
      );
    };
    fetchPersonDetails();
  }, [personId, authFetch]);

  const deletePerson = useCallback(
    async (id: string | undefined) => {
      id && authFetch(`${API_URL}/people/?id=${id}`, { method: "DELETE" });
    },
    [authFetch]
  );

  const invitePerson = useCallback(
    async (id: string | undefined) => {
      id &&
        authFetch(`${API_URL}/auth/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ target_user_id: id }),
        });
    },
    [authFetch]
  );

  const deleteClickHandler = useCallback(() => {
    deletePerson(personId);
    if (personId == user?.id) {
      signout();
      return;
    }
    router.back();
  }, [deletePerson, router, personId, signout, user]);

  const deleteConfirmModal = (
    <Modal isCentered isOpen={isDeleteOpen} onClose={onDeleteClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <ModalHeader textAlign={"center"}>
            {personId == user?.id ? (
              <Text>
                Are you sure you want to remove your account and all your
                relationships?
              </Text>
            ) : (
              <Text>
                Are you sure you want to remove {personDetails?.at(0)?.name} and
                all associated relationships?
              </Text>
            )}
          </ModalHeader>
        </ModalBody>
        <ModalFooter display={"flex"} justifyContent={"space-around"}>
          <Button
            aria-label="delete-person"
            colorScheme={"red"}
            onClick={deleteClickHandler}
          >
            <WarningIcon border={"0"} p={"1"} boxSize={"20px"} />
            Delete
          </Button>
          <Button onClick={onDeleteClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const inviteModal = (
    <Modal isCentered isOpen={isInviteOpen} onClose={onInviteClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <ModalHeader textAlign={"center"}>
            Invite {personDetails?.at(0)?.name} to family tree with the link
            below:
          </ModalHeader>
          <InputGroup>
            <Input isReadOnly placeholder="Loading invite link..." />
            <InputRightElement>
              <IconButton
                aria-label="copy"
                icon={<CopyIcon border="0" color="green.500" />}
                onClick={() => console.log("copied!")}
              />
            </InputRightElement>
          </InputGroup>
        </ModalBody>
        <ModalFooter
          display={"flex"}
          justifyContent={"space-around"}
        ></ModalFooter>
      </ModalContent>
    </Modal>
  );
  const userStats = (
    <HStack marginY={"20px"}>
      <Stat>
        <StatLabel># Siblings</StatLabel>
        <StatNumber>{siblingCount ?? <Spinner />}</StatNumber>
      </Stat>
      <Stat>
        <StatLabel># Children</StatLabel>
        <StatNumber>{childrenCount ?? <Spinner />}</StatNumber>
      </Stat>
      <Stat>
        <StatLabel># 1st Cousins</StatLabel>
        <StatNumber>{cousinCount ?? <Spinner />}</StatNumber>
      </Stat>
      <Stat>
        <StatLabel># Aunts/Uncles</StatLabel>
        <StatNumber>{auncleCount ?? <Spinner />}</StatNumber>
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
          <HStack width="inherit" justifyContent="space-evenly">
            <Button
              aria-label="delete-person"
              size="lg"
              colorScheme={"red"}
              onClick={() => onDeleteOpen()}
            >
              Delete
            </Button>
            <Button
              aria-label="invite-person"
              size="lg"
              colorScheme={"blue"}
              onClick={() => onInviteOpen()}
            >
              Invite
            </Button>
          </HStack>
          {deleteConfirmModal}
          {inviteModal}
        </>
      )}
    </>
  );
};

export default PersonPage;
