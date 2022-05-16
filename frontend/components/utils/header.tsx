import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, SimpleGrid } from "@chakra-ui/react";

interface HeaderProps {
  title: string;
  clickHandler: () => void | null;
}
const Header: React.FC<HeaderProps> = ({ title, clickHandler }) => {
  return (
    <SimpleGrid
      columns={3}
      minW="60%"
      justifyItems="center"
      alignItems="center"
    >
      <Box></Box>
      <Heading my={2} textAlign="center">
        {title}
      </Heading>
      {clickHandler && (
        <Button justifySelf="end" onClick={clickHandler}>
          <AddIcon mx={2} />
        </Button>
      )}
    </SimpleGrid>
  );
};

export default Header;
