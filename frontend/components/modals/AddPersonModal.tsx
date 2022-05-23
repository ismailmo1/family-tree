import {
  Center,
  Container,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import CreatePersonForm from "../forms/AddPersonForm";

interface addModalProps {
  relation: string;
  onClose(): void;
  isOpen: boolean;
  onAddPerson: () => void;
}

const AddPersonModal: React.FC<addModalProps> = ({
  isOpen,
  onClose,
  relation,
  onAddPerson,
}) => {
  const title = relation.charAt(0).toUpperCase() + relation.slice(1);

  return (
    <Modal
      scrollBehavior="inside"
      size="full"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalCloseButton />
        <Center py="10">
          <Heading>Add New {title}</Heading>
        </Center>
        <Container>
          <CreatePersonForm onAddPerson={onAddPerson} />
        </Container>
      </ModalContent>
    </Modal>
  );
};

export default AddPersonModal;
