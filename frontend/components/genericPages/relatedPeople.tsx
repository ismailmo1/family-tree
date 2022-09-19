import {
  ToastId,
  useDisclosure,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchResults from "../../components/cards/SearchResults";
import FindPersonModal from "../../components/modals/FindPersonModal";
import { API_URL } from "../../globals";
import { useAuth } from "../../hooks/use-auth";
import { PersonMatchResult } from "../../types/person";
import { addRelationSuccessResponse } from "../../types/relationships";
import RelationHeader from "../headers/RelationHeader";
import AddPersonModal from "../modals/AddPersonModal";
interface GenericRelationPageProps {
  genGetPeopleUrl(id: string): string;
  genAddPeopleUrl(id: string, id_to_add: string): string;
  relation: "sibling" | "parent" | "spouse";
}
const RelatedPeoplePage: React.FC<GenericRelationPageProps> = ({
  relation,
  genGetPeopleUrl,
  genAddPeopleUrl,
}) => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const errorToastIdRef = useRef<ToastId>();
  const [peopleDetails, setPeopleDetails] = useState<PersonMatchResult[]>();
  // find person modal
  const {
    isOpen: isFindOpen,
    onOpen: onFindOpen,
    onClose: onFindClose,
  } = useDisclosure();

  // new person modal
  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();

  const toast = useToast();
  const title = relation.charAt(0).toUpperCase() + relation.slice(1);
  const { authFetch } = useAuth();

  const fetchPeople = useCallback(
    async (url: string) => {
      const peopleData = await authFetch<PersonMatchResult[]>(API_URL + url);
      setPeopleDetails(peopleData);
    },
    [authFetch]
  );

  useEffect(() => {
    if (!personId) {
      return;
    }
    const getPeopleUrl = genGetPeopleUrl(personId.toString());
    fetchPeople(getPeopleUrl);
  }, [personId, isFindOpen, isNewOpen, fetchPeople, genGetPeopleUrl]);

  const addRelation = async (newPersonId: string) => {
    if (!personId) {
      return;
    }
    const addPeopleUrl = genAddPeopleUrl(personId.toString(), newPersonId);
    // const res = await fetch(addPeopleUrl, { method: "POST" });
    // const addPersonData: addRelationSuccessResponse = await res.json();
    const addPersonData: addRelationSuccessResponse | undefined =
      await authFetch<addRelationSuccessResponse>(API_URL + addPeopleUrl, {
        method: "POST",
      });
    const successToastOptions: UseToastOptions = {
      title: `${title} added!`,
      description: `${addPersonData?.person.name} added as ${relation}!`,
      status: "success",
      duration: 5000,
      isClosable: true,
    };
    toast(successToastOptions);
    onFindClose();
  };

  return (
    <>
      <RelationHeader
        title={`${title}s`}
        openFindModal={onFindOpen}
        openAddModal={onNewOpen}
      />

      {peopleDetails && <SearchResults personMatches={peopleDetails} />}

      <FindPersonModal
        relation={relation}
        onClose={onFindClose}
        isOpen={isFindOpen}
        onCardClick={addRelation}
      />
      <AddPersonModal
        isOpen={isNewOpen}
        onClose={onNewClose}
        relation={relation}
        onAddPerson={addRelation}
      />
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default RelatedPeoplePage;
