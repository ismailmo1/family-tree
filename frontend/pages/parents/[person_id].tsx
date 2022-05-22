import { useDisclosure, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import SearchResults from "../../components/cards/SearchResults";
import FindPersonModal from "../../components/modals/FindPersonModal";
import Header from "../../components/utils/PageHeader";
import { PersonMatchResult } from "../../types/person";
import { addParentSuccessResponse } from "../../types/relationships";

const ParentsPage: NextPage = () => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const [parentDetails, setParentDetails] = useState<PersonMatchResult[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (!personId) {
      return;
    }
    const fetchParentDetails = async () => {
      const res = await fetch(`http://localhost:8000/parents/?id=${personId}`);
      const data: PersonMatchResult[] = await res.json();
      setParentDetails(data);
    };
    fetchParentDetails();
  }, [personId, isOpen]);

  const onCardClick = async (e: MouseEvent<HTMLElement>) => {
    const parentId = e.currentTarget.id;
    const res = await fetch(
      `http://localhost:8000/parents/?child_id=${personId}&parent_id=${parentId}`,
      { method: "POST" }
    );
    const addParentData: addParentSuccessResponse = await res.json();

    toast({
      title: "Parent Added",
      description: `${addParentData.parent.name} added as parent!`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <>
      <Header title="Parents" clickHandler={onOpen} />
      {parentDetails ? (
        <SearchResults personMatches={parentDetails} />
      ) : (
        "searching for parents..."
      )}
      <FindPersonModal
        relation="parent"
        onClose={onClose}
        isOpen={isOpen}
        onCardClick={onCardClick}
      />
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default ParentsPage;
