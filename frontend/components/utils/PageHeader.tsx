import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger as OrigPopoverTrigger,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode } from "react";
interface HeaderProps {
  title: string;
  openFindModal: () => void | null;
  openAddModal: () => void | null;
}

// get around react 18 types
const PopoverTrigger: React.FC<{ children: ReactNode }> = OrigPopoverTrigger;

const RelationHeader: React.FC<HeaderProps> = ({
  title,
  openFindModal,
  openAddModal,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
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

      <>
        <Popover
          returnFocusOnClose={false}
          isOpen={isOpen}
          onClose={onClose}
          placement="auto"
          closeOnBlur={true}
        >
          <PopoverTrigger>
            <Button justifySelf="end" onClick={onToggle}>
              <AddIcon mx={2} />
            </Button>
          </PopoverTrigger>
          <PopoverContent width="inherit">
            <PopoverCloseButton />
            <Center>
              <ButtonGroup>
                <Button onClick={openAddModal}>Add Person</Button>
                <Button onClick={openFindModal}>Find Person</Button>
              </ButtonGroup>
            </Center>
          </PopoverContent>
        </Popover>
      </>
    </SimpleGrid>
  );
};

export default RelationHeader;
