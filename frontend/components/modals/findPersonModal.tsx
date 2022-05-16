import {
  Center,
  Container,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import FindForm from "../forms/findPerson";
interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const FindPersonModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
          <Heading>Find Siblings</Heading>
        </Center>
        <Container>
          <FindForm />
        </Container>
      </ModalContent>
    </Modal>
  );
};

export default FindPersonModal;
