type Fx<S> = (...args: unknown[]) => Fxx<S>;
type Fxx<S> = S | ((...args: unknown[]) => S | Fx<S>);

/**
 * Curries a function by returning a new function that accepts partial arguments until all arguments are provided, then it invokes the original function.
 *
 * @param {Fx<S>} fn - The original function to be curried.
 * @param {...unknown[]} args - Additional arguments to be partially applied.
 * @return {Fxx<S>} The curried function.
 */
export function curry<S>(fn0: Fx<S>, ...args0: unknown[]): Fxx<S> {
  const accArgs = [...args0];

  const fn = (...args: unknown[]): Fxx<S> => {
    accArgs.push(...args);
    return (accArgs.length >= fn0.length) ? fn0(...accArgs) : fn;
  }

  return fn
} 
