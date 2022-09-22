import * as d3 from "d3";
import _ from "lodash";
import dTree from "d3-dtree";
import { useEffect, useMemo, useRef, useState } from "react";
import { NuclearFamily } from "../../types/family";
import { useRouter } from "next/router";
import styles from "./Tree.module.css";
import { PersonMatchResult } from "../../types/person";

const FamilyTree: React.FC<{
  family: NuclearFamily;
  onNodeClick: (name: string, id: string) => void;
}> = ({ family, onNodeClick }) => {
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
          onNodeClick(name, extra.id);
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
  }, [treeData, onNodeClick]);

  return <div className={styles.graph} ref={graphDiv} id="graph"></div>;
};

export default FamilyTree;
