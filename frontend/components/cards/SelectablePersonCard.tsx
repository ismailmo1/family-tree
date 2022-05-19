import { Box, Heading, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { MouseEvent } from "react";
import { PersonMatchResult } from "../../types/person";

interface SelectablePersonCardProps extends PersonMatchResult {
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

const SelectablePersonCard: React.FC<SelectablePersonCardProps> = ({
  name,
  id,
  onClick,
}) => {
  return (
    <Box
      id={id}
      as="button"
      p={10}
      bgColor="#B4CFB0"
      width={"100%"}
      rounded="lg"
      onClick={onClick}
    >
      <VStack>
        <Link href={`/person/${id}`}>
          <Heading mb={4} size="lg">
            {name}
          </Heading>
        </Link>
      </VStack>
    </Box>
  );
};

export default SelectablePersonCard;
