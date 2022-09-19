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
import { useEffect, useMemo, useRef, useState } from "react";
import { NuclearFamily } from "../../types/family";
import SimplePersonCard from "../cards/SimplePersonCard";
import { useRouter } from "next/router";
import styles from "./Tree.module.css";
import { PersonMatchResult } from "../../types/person";
import PersonCard from "../cards/PersonCard";

const FamilyTree: React.FC<{ family: NuclearFamily }> = ({ family }) => {
  const router = useRouter();
  const { person_id: personId } = router.query;
  const currPerson = [...family.parents, ...family.children].find(
    (person) => person.id == personId
  );
  const [activeNode, setActiveNode] = useState<PersonMatchResult | undefined>(
    currPerson
  );

  // HACK: get d3 and lodash to work this way
  window.d3 = d3;
  window._ = _;

  const treeData = useMemo(
    () => [
      {
        name: family.parents[0]?.name || "No Parent Found", // The name of the node
        class: styles.mainNode, // The CSS class of the node
        textClass: "nodeText", // The CSS class of the text in the node
        depthOffset: 1, // Generational height offset
        marriages: [
          {
            // Marriages is a list of nodes
            spouse: {
              // Each marriage has one spouse
              name: family.parents[1]?.name || "No Spouse Found",
              class: styles.spouseNode,
              extra: { id: family.parents[1]?.id },
            },
            children: family.children?.map((child) => {
              return {
                ...child,
                class: styles.childNode,
                extra: { id: child.id },
              }; // add id to extra obj to allow callbacks
            }),
          },
        ],
        extra: { id: family.parents[0]?.id }, // Custom data passed to renderers
      },
    ],
    [family]
  );
  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // HACK remove tree if it exists already
    if (graphDiv?.current?.children.length) {
      // remove graph on subsequent renders

      graphDiv.current.removeChild(graphDiv.current.children[0]);
    }
    dTree.init(treeData, {
      width: 600,
      height: 200,
      callbacks: {
        nodeClick: (name: string, extra: { id: string }, id: number) => {
          setActiveNode({ name: name, id: extra.id });
          //router.push(`/person/${extra.id}`);
        },
        nodeRenderer: function (
          name: string,
          x: Number,
          y: Number,
          height: Number,
          width: Number,
          extra: {},
          id: string,
          nodeClass: string,
          textClass: string,
          textRenderer: (name: string, extra: {}, textClass: string) => string
        ) {
          // This callback is optional but can be used to customize the
          // node element using HTML.
          let node = "";
          node += "<div ";
          node += 'style="height:100%;width:100%;" ';
          node += 'class="' + nodeClass + '" ';
          node += 'id="node' + id + '">\n';
          node += textRenderer(name, extra, textClass);
          node += "</div>";

          return node;
        },
      },
    });
  }, [treeData]);

  const activeNodeCard = (
    <>
      <Center>
        {activeNode ? (
          <PersonCard name={activeNode.name} id={activeNode.id} />
        ) : (
          ""
        )}
      </Center>
    </>
  );

  return (
    <Container maxWidth="1700px" py={5}>
      <div className={styles.graph} ref={graphDiv} id="graph"></div>
      <VStack>
        <Heading size={"md"} marginTop={"10px"}>
          Pick a family member in the tree above:
        </Heading>
        <div>{activeNodeCard}</div>
      </VStack>
    </Container>
  );
};

export default FamilyTree;
