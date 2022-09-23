import { DeleteIcon } from "@chakra-ui/icons";
import {
  Center,
  Container,
  Heading,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import PersonCard from "../../components/cards/PersonCard";
import FamilyTree from "../../components/tree/FamilyTree";
import { API_URL } from "../../globals";
import { useAuth } from "../../hooks/use-auth";
import { NuclearFamily } from "../../types/family";
import { PersonMatchResult } from "../../types/person";

const FamilyPage: NextPage = () => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const [family, setFamily] = useState<NuclearFamily>();
  const { perspective } = router.query;
  const { authFetch } = useAuth();
  let currPerson;

  const [activeNode, setActiveNode] = useState<PersonMatchResult | undefined>(
    currPerson
  );
  const fetchFamily = useCallback(async () => {
    await authFetch<NuclearFamily>(
      `${API_URL}/family/nuclear?${perspective}_id=${personId}`
    ).then((data) => {
      setFamily(data);
    });
  }, [authFetch, personId, perspective]);

  useEffect(() => {
    if (!personId || !perspective) {
      return;
    }

    fetchFamily();
  }, [fetchFamily, personId, perspective]);
  if (family) {
    currPerson = [...family?.parents, ...family?.children].find(
      (person) => person.id == personId
    );
  }

  const activeNodeCard = (
    <>
      <Center width={"80%"}>
        {activeNode ? (
          <PersonCard name={activeNode.name} id={activeNode.id} />
        ) : (
          ""
        )}
      </Center>
    </>
  );
  return (
    <>
      <Heading>Family</Heading>
      <Container maxWidth="1700px" py={5} width={"full"}>
        {family ? (
          <FamilyTree
            family={family}
            onNodeClick={(name: string, id: string) =>
              setActiveNode({ name: name, id: id })
            }
          />
        ) : (
          "finding family..."
        )}
      </Container>
      <VStack w={"full"}>
        <Heading size={"md"} marginTop={"10px"}>
          Pick a family member in the tree above:
        </Heading>
        {activeNodeCard}
      </VStack>
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default FamilyPage;
