import { useDisclosure } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchResults from "../../../components/cards/SearchResults";
import FindPersonModal from "../../../components/modals/findPersonModal";
import Header from "../../../components/utils/header";
import { PersonMatchResult } from "../../../types/person";

const SiblingsPage: NextPage = () => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const [siblings, setSiblings] = useState<PersonMatchResult[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
  }, [personId]);

  return (
    <>
      <Header title="Siblings" clickHandler={onOpen} />
      {siblings ? <SearchResults personMatches={siblings} /> : ""}
      <FindPersonModal onClose={onClose} isOpen={isOpen} />
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default SiblingsPage;
