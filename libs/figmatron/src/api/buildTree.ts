import { EvaluationContext } from "../../types";
import { RootNode } from "../nodes/RootNode";

export const buildTree = (context: EvaluationContext = {}) => {
  const root = new RootNode({
    nodes: context.nodes,
  });

  root.evaluate(context);

  return root;
};
