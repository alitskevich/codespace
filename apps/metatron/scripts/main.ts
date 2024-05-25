import { OPERATIONS } from "figmatron/scripts/operations";
import { capitalize } from "ultimus";

import { config } from "./config";

/**
 * Executes a list of operations asynchronously.
 *
 * This code defines a function called main that executes a list of operations asynchronously.
 * It takes an array of strings called operations as input.
 * It iterates over each operation in the array, and for each operation,
 * it looks for a corresponding function in the OPERATIONS object.
 * If the function is found, it is executed with a config argument.
 * If the function is not found, a warning message is logged.
 * The function returns a promise that resolves when all operations are complete.
 *
 * @param {string[]} operations - The list of operations to execute.
 * @return {Promise<void>} - A promise that resolves when all operations are complete.
 */
export async function main(operations: string[]) {
  for (const op of operations) {
    const fnctor = OPERATIONS[`do${capitalize(op)}`];
    if (!fnctor) {
      console.warn(`Unknown operation: ${op}`);
      continue;
    }
    await fnctor(config);
  }
}

// console.log(process.argv, process.env);

const operations = String(process.argv[2] ?? config.defaultOperation).split(",");

main(operations);
