import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FamilyTree from "../../components/cards/FamilyTree";
import { NuclearFamily } from "../../types/family";

const FamilyPage: NextPage = () => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const [family, setFamily] = useState<NuclearFamily>();
  const { perspective } = router.query;

  useEffect(() => {
    if (!personId || !perspective) {
      return;
    }

    const fetchFamily = async () => {
      const res = await fetch(
        `http://localhost:8000/family/nuclear?${perspective}_id=${personId}`
      );
      const data: NuclearFamily = await res.json();
      setFamily(data);
    };
    fetchFamily();
  }, [personId, perspective]);

  return (
    <>
      <Heading>Family</Heading>
      {family ? <FamilyTree family={family} /> : "finding family..."}
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default FamilyPage;
