import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchResults from "../../components/cards/SearchResults";
import { PersonMatchResult } from "../../types/person";

const ParentsPage: NextPage = () => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const [parentDetails, setParentDetails] = useState<PersonMatchResult[]>();

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
  }, [personId]);

  return (
    <>
      <Heading py={5}>Parents</Heading>
      {parentDetails ? <SearchResults personMatches={parentDetails} /> : ""}
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default ParentsPage;
