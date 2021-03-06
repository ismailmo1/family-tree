import {
  Center,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import * as d3 from "d3";
import dTree from "d3-dtree";
import _ from "lodash";
import { useRef } from "react";
import { NuclearFamily } from "../../types/family";
import SimplePersonCard from "./SimplePersonCard";

const FamilyTree: React.FC<{ family: NuclearFamily }> = ({ family }) => {
  window.d3 = d3;
  const graphDiv = useRef<HTMLDivElement>(null);
  if (graphDiv?.current?.children.length) {
    // remove graph on subsequent renders
    console.log("removing graph");

    graphDiv.current.removeChild(graphDiv.current.children[0]);
    console.log("creating graph");
    console.log(family);

    dTree.init([
      {
        name: family.parents[0].name, // The name of the node
        class: "node", // The CSS class of the node
        textClass: "nodeText", // The CSS class of the text in the node
        depthOffset: 1, // Generational height offset
        marriages: [
          {
            // Marriages is a list of nodes
            spouse: {
              // Each marriage has one spouse
              name: family.parents[1].name,
            },
            children: family.children,
          },
        ],
        extra: {}, // Custom data passed to renderers
      },
    ]);
  }

  const parentCards = (
    <>
      <Heading>Parents</Heading>
      <HStack>
        {family.parents.length > 0 ? (
          family.parents.map((parent) => {
            return (
              <SimplePersonCard
                key={parent.id}
                name={parent.name}
                id={parent.id}
              />
            );
          })
        ) : (
          <Text>No Parents Found :(</Text>
        )}
      </HStack>
    </>
  );

  const siblingCards = (
    <>
      <Heading>Children</Heading>
      <Wrap spacing="10px" align="center" justify="center">
        {family.children.map((children) => {
          return (
            <WrapItem key={children.id}>
              <Center>
                <SimplePersonCard name={children.name} id={children.id} />
              </Center>
            </WrapItem>
          );
        })}
      </Wrap>
    </>
  );

  return (
    <Container minWidth={"60%"} py={5}>
      <div ref={graphDiv} id="graph"></div>
      <VStack>
        {parentCards}
        {siblingCards}
      </VStack>
    </Container>
  );
};

export default FamilyTree;
