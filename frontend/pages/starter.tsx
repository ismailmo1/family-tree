import {
  EditIcon,
  Search2Icon,
  SettingsIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { Center, Heading, SimpleGrid } from "@chakra-ui/react";
import { NextPage } from "next";
import StarterCard from "../components/cards/StarterCard";

const Starter: NextPage = () => {
  return (
    <>
      <Center py="10">
        <Heading>Welcome To Family Tree!</Heading>
      </Center>
      <SimpleGrid spacing="20px" columns={{ sm: 1, md: 2 }}>
        <StarterCard
          icon={Search2Icon}
          title="Search for family members"
          link="/find"
        />
        <StarterCard
          icon={ViewIcon}
          title="Explore your family tree"
          link="/explore"
        />
        <StarterCard
          icon={EditIcon}
          title="Edit your family info"
          link="/edit"
        />
        <StarterCard
          icon={SettingsIcon}
          title="Configure your Account"
          link="/account"
        />
      </SimpleGrid>
    </>
  );
};

export default Starter;
