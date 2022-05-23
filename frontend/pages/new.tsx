import { Center, Container, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import CreatePersonForm from "../components/forms/AddPersonForm";
const Find: NextPage = () => {
  return (
    <>
      <Center py="10">
        <Heading>Add New Person</Heading>
      </Center>
      <Container minWidth={"60%"}>
        <CreatePersonForm />
      </Container>
    </>
  );
};

export default Find;
