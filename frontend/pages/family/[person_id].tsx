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
  console.log("rendering fam page");

  const router = useRouter();
  const { person_id: personId } = router.query;
  const [family, setFamily] = useState<NuclearFamily>();
  const { perspective } = router.query;
  const { authFetch } = useAuth();
  useEffect(() => {
    if (!personId || !perspective) {
      console.log(personId);

      return;
    }
    const fetchFamily = async () => {
      await authFetch<NuclearFamily>(
        `${API_URL}/family/nuclear?${perspective}_id=${personId}`
      ).then((data) => {
        setFamily(data);
      });

      // setFamily({
      //   parents: [
      //     { id: "strin1g", name: "string2" },
      //     { id: "string1", name: "string2" },
      //   ],
      //   children: [{ id: "string3", name: "string3" }],
      // });
    };

    fetchFamily();
  }, []);

  console.log(family);
  return (
    <>
      <Heading>Family</Heading>
      {family ? <FamilyTree family={family} /> : "finding family..."}
      <Link href={`/person/${personId}`}>Back to person details</Link>
    </>
  );
};

export default FamilyPage;
