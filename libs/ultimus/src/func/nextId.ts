/**
 * incremental Uid generation function.
 *
 * @returns new unique Uid
 */

import { Uid } from "../../types";

let COUNTER = 1;

export const nextId = (p = ""): Uid => p + String(COUNTER++);
