import { AddIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchResults from "../../components/cards/SearchResults";
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
      const res = await fetch(`http://localhost:8000/people/?id=${personId}`);
      const data: PersonMatchResult[] = await res.json();
      setPersonDetails(data);
    };
    fetchPersonDetails();
  }, [personId]);

  return (
    <>
      <Heading>Details</Heading>
      {personDetails ? <SearchResults personMatches={personDetails} /> : ""}
      <ButtonGroup orientation="horizontal">
        <Button>
          <AddIcon mx={2} /> Sibling
        </Button>
        <Button>
          <AddIcon mx={2} /> Spouse
        </Button>
        <Button>
          <AddIcon mx={2} /> Children
        </Button>
      </ButtonGroup>
    </>
  );
};

export default PersonPage;
