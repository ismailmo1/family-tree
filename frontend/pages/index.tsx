import { Button, Heading, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => (
  <VStack height="100vh" justifyContent="center" spacing="100">
    <Heading>Family Tree</Heading>
    <Button>
      <Link href="/starter">Get Started!</Link>
    </Button>
  </VStack>
);

export default Home;
