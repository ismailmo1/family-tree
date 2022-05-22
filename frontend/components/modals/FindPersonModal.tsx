import {
  Center,
  Container,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { MouseEvent } from "react";
import SelectablePersonCard from "../cards/SelectablePersonCard";
import FindForm from "../forms/FindPersonForm";

interface ModalProps {
  relation: string;
  onClose(): void;
  isOpen: boolean;
  onCardClick: (e: MouseEvent<HTMLElement>) => void;
}

const FindPersonModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onCardClick,
  relation,
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
          <Heading>Find {title}</Heading>
        </Center>
        <Container>
          <FindForm
            personCard={SelectablePersonCard}
            onClick={onCardClick}
            searchHeading={`Select a card to add as ${relation}`}
          />
        </Container>
      </ModalContent>
    </Modal>
  );
};

export default FindPersonModal;
