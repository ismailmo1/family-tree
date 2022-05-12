import { Box, Button, Center, FormControl, FormLabel, Heading, Input, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { useCallback, useRef, useState } from "react";

interface Person {
    id: string,
    name: string
}

interface Family {
    parents: [Person, Person]
    children: Array<Person>
}

const Starter: NextPage = () => {
    const personName = useRef<HTMLInputElement>(null)
    const [personMatches, setPersonMatches] = useState<Person[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const searchPerson = useCallback(async () => {
        setIsFetching(true)
        const res: Response = await fetch(`http://localhost:8000/people/?name=${personName.current?.value}`)
        const peopleMatches: Person[] = await res.json()
        setPersonMatches(peopleMatches)
        setIsFetching(false)
    }, [])

    const peopleMatchCards = personMatches.map((p) => {
        return (
            <Box>
                {p.name} : {p.id}
            </Box>)
    })


    return (
        <>
            <Center py="10">
                <Heading>Starter</Heading>
            </Center>
            <FormControl>
                <FormLabel htmlFor='name'>Enter your name</FormLabel>
                <Input id='name' ref={personName} />
                <Center py='5'>
                    <Button onClick={searchPerson}>{isFetching ? 'Loading' : 'Search'}</Button>
                </Center>
            </FormControl>

            <VStack>
                {peopleMatchCards}
            </VStack>
        </>
    )
}

export default Starter