import { Box, Heading, HStack } from "@chakra-ui/react";
import Link from "next/link";

interface PersonCardProps {
    name: string
    id: string
}

const PersonCard: React.FC<PersonCardProps> = ({ name, id }) => {
    return <Link href={`/person/${id}`}>
        <Box p={10} as="button" bgColor='lightgrey' width={'100%'} >
            <HStack>
                <Heading mb={4} size='lg'>
                    {name}
                </Heading>
            </HStack>
        </Box >
    </Link>
}

export default PersonCard;