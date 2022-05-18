import { Center, Container, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import PersonCard from "../components/cards/PersonCard";
import FindForm from "../components/forms/FindPersonForm";
const Find: NextPage = () => {
  return (
    <>
      <Center py="10">
        <Heading>Find</Heading>
      </Center>
      <Container minWidth={"60%"}>
        <FindForm personCard={PersonCard} />
      </Container>
    </>
  );
};

export default Find;
