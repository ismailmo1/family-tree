import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface PersonDetails {
    props: {
        id: string,
        name: string
    }
}


const PersonPage: NextPage = () => {
    const router = useRouter()
    const { person_id: personId } = router.query
    const currPath = router.asPath;
    const [personDetails, setPersonDetails] = useState<PersonDetails[]>();

    useEffect(() => {
        if (!personId) {
            return;
        }

        const fetchPersonDetails = async () => {
            const res = await fetch(`http://localhost:8000/people/?id=${personId}`)
            const data: PersonDetails[] = await res.json()
            setPersonDetails(data)
        }
        fetchPersonDetails();
    }, [personId])

    return (
        <>
            <Heading>
                Siblings
            </Heading>
            {personDetails ? personDetails[0].props?.name : ""}
            <Link href={`/person/${personId}`}>Back to person details</Link>
        </>
    )
}

export default PersonPage;