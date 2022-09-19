import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FamilyTree from "../../components/tree/FamilyTree";
import { API_URL } from "../../globals";
import { useAuth } from "../../hooks/use-auth";
import { NuclearFamily } from "../../types/family";

const FamilyPage: NextPage = () => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const [family, setFamily] = useState<NuclearFamily>();
  const { perspective } = router.query;
  const { authFetch } = useAuth();
  useEffect(() => {
    if (!personId || !perspective) {
      return;
    }
    const fetchFamily = async () => {
      await authFetch<NuclearFamily>(
        `${API_URL}/family/nuclear?${perspective}_id=${personId}`
      ).then((data) => {
        setFamily(data);
      });
    };

    fetchFamily();
  }, [authFetch, personId, perspective]);

  return (
    <>
      <Heading>Family</Heading>
      {family ? <FamilyTree family={family} /> : "finding family..."}
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default FamilyPage;
