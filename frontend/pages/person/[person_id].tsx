import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchResults from "../../components/cards/SearchResults";
import { API_URL } from "../../globals";
import { PersonMatchResult } from "../../types/person";

const PersonPage: NextPage = () => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const [personDetails, setPersonDetails] = useState<PersonMatchResult[]>();

  useEffect(() => {
    if (!personId) {
      return;
    }

    const fetchPersonDetails = async () => {
      const res = await fetch(`${API_URL}/people/?id=${personId}`);
      const data: PersonMatchResult[] = await res.json();
      setPersonDetails(data);
    };
    fetchPersonDetails();
  }, [personId]);

  return (
    <>
      <Heading>Details</Heading>
      {personDetails ? <SearchResults personMatches={personDetails} /> : ""}
    </>
  );
};

export default PersonPage;
