import { Icon } from "@chakra-ui/icons";
import { Box, Heading, HStack } from "@chakra-ui/react";
import Link from "next/link";

interface StarterCardProps {
  icon: typeof Icon;
  title: string;
  link: string;
}

const StarterCard: React.FC<StarterCardProps> = ({ icon, title, link }) => {
  const CardIcon = icon;
  return (
    <Link href={link}>
      <Box p={10} minH="20vh" as="button" bgColor="lightgrey">
        <HStack>
          <CardIcon w={100} h={100} />
          <Heading mb={4} size="lg">
            {title}
          </Heading>
        </HStack>
      </Box>
    </Link>
  );
};

export default StarterCard;
