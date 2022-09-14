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
import _ from "lodash";
import dTree from "d3-dtree";
import { useEffect, useRef } from "react";
import { NuclearFamily } from "../../types/family";
import SimplePersonCard from "../cards/SimplePersonCard";
import { useRouter } from "next/router";
import styles from "./Tree.module.css";

const FamilyTree: React.FC<{ family: NuclearFamily }> = ({ family }) => {
  console.log("rendering tree");
  const router = useRouter();
  window.d3 = d3;
  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // HACK remove tree if it exists already
    if (graphDiv?.current?.children.length) {
      // remove graph on subsequent renders
      console.log("removing graph");

      graphDiv.current.removeChild(graphDiv.current.children[0]);
    }
    dTree.init(
      [
        {
          name: family.parents[0].name, // The name of the node
          class: styles.mainNode, // The CSS class of the node
          textClass: "nodeText", // The CSS class of the text in the node
          depthOffset: 1, // Generational height offset
          marriages: [
            {
              // Marriages is a list of nodes
              spouse: {
                // Each marriage has one spouse
                name: family.parents[1].name,
                class: styles.spouseNode,
                extra: { id: family.parents[1].id },
              },
              children: family.children.map((child) => {
                return {
                  ...child,
                  class: styles.childNode,
                  extra: { id: child.id },
                }; // add id to extra obj to allow callbacks
              }),
            },
          ],
          extra: { id: family.parents[0].id }, // Custom data passed to renderers
        },
      ],
      {
        callbacks: {
          nodeClick: (name: string, extra: { id: string }, id: number) => {
            console.log(name, extra, id);
            router.push(`/person/${extra.id}`);
          },
        },
      }
    );
  }, [_]); //HACK add dependency to lodash otherwise it doesn't import properly

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
