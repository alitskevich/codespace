import { doGenerateReact } from "../to-react/doGenerateReact";

import { doFetchContract } from "./doFetchContract";
import { doFetchFigmaFile } from "./doFetchFigmaFile";
import { doFetchFigmaVars } from "./doFetchFigmaVars";
import { doGenerateColors } from "./doGenerateColors";
import { doGenerateContract } from "./doGenerateContract";
import { doGenerateSvg } from "./doGenerateSvg";
import { doGenerateUiSpec } from "./doGenerateUiSpec";
import { doNormalize } from "./doNormalize";
import { doVersionUp } from "./doVersionUp";

export const OPERATIONS: Record<string, (config: any) => void> = {
  doFetchContract,
  doFetchFigmaFile,
  doFetchFigmaVars,
  doNormalize,

  doGenerateContract,
  doGenerateUiSpec,
  doGenerateReact,
  doGenerateSvg,
  doGenerateColors,

  doVersionUp,
};
