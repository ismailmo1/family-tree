import { useDisclosure, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import SearchResults from "../../components/cards/SearchResults";
import FindPersonModal from "../../components/modals/FindPersonModal";
import Header from "../../components/utils/PageHeader";
import { PersonMatchResult } from "../../types/person";
import { addSiblingSuccessResponse } from "../../types/relationships";

const SiblingsPage: NextPage = () => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const [siblings, setSiblings] = useState<PersonMatchResult[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  useEffect(() => {
    if (!personId) {
      return;
    }

    const fetchPersonDetails = async () => {
      const res = await fetch(
        `http://localhost:8000/family/siblings?id=${personId}`
      );
      const data: PersonMatchResult[] = await res.json();
      setSiblings(data);
    };
    fetchPersonDetails();
  }, [personId, isOpen]);

  const onCardClick = async (e: MouseEvent<HTMLElement>) => {
    const siblingToAdd = e.currentTarget.id;
    const res = await fetch(
      `http://localhost:8000/family/siblings?person_id=${personId}&sibling_to_add_id=${siblingToAdd}`,
      { method: "POST" }
    );
    const addSiblingData: addSiblingSuccessResponse = await res.json();

    toast({
      title: "Sibling Added",
      description: `${addSiblingData.child.name} added to the family!`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <>
      <Header title="Siblings" clickHandler={onOpen} />
      {siblings ? <SearchResults personMatches={siblings} /> : ""}
      <FindPersonModal
        onClose={onClose}
        isOpen={isOpen}
        onCardClick={onCardClick}
      />
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default SiblingsPage;
