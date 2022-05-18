import { Center, Container, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import FindForm from "../components/forms/FindPerson";

const Find: NextPage = () => {
  return (
    <>
      <Center py="10">
        <Heading>Find</Heading>
      </Center>
      <Container minWidth={"60%"}>
        <FindForm />
      </Container>
    </>
  );
};

export default Find;
