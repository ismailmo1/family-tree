import { useDisclosure, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import SearchResults from "../../components/cards/SearchResults";
import FindPersonModal from "../../components/modals/FindPersonModal";
import Header from "../../components/utils/PageHeader";
import { PersonMatchResult } from "../../types/person";
import { addRelationSuccessResponse } from "../../types/relationships";

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
  const [peopleDetails, setPeopleDetails] = useState<PersonMatchResult[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const title = relation.charAt(0).toUpperCase() + relation.slice(1);

  useEffect(() => {
    if (!personId) {
      return;
    }
    const getPeopleUrl = genGetPeopleUrl(personId.toString());
    const fetchParentDetails = async () => {
      const res = await fetch(getPeopleUrl);
      const data: PersonMatchResult[] = await res.json();
      setPeopleDetails(data);
    };
    fetchParentDetails();
  }, [personId, isOpen]);

  const onCardClick = async (e: MouseEvent<HTMLElement>) => {
    if (!personId) {
      return;
    }
    const newPerson = e.currentTarget.id;
    const addPeopleUrl = genAddPeopleUrl(personId.toString(), newPerson);
    const res = await fetch(addPeopleUrl, { method: "POST" });
    const addPersonData: addRelationSuccessResponse = await res.json();

    toast({
      title: `${title} added!`,
      description: `${addPersonData.person.name} added as ${relation}!`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <>
      <Header title={`${title}s`} clickHandler={onOpen} />
      {peopleDetails ? (
        <SearchResults personMatches={peopleDetails} />
      ) : (
        `searching for ${relation}s...`
      )}
      <FindPersonModal
        relation={relation}
        onClose={onClose}
        isOpen={isOpen}
        onCardClick={onCardClick}
      />
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default RelatedPeoplePage;
