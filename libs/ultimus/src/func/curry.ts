type Fx<S> = (...args: unknown[]) => Fxx<S>;
type Fxx<S> = S | ((...args: unknown[]) => S | Fx<S>);

const _curry = <S>(fn: Fx<S>, args0: unknown[], lengthLimit: number): Fxx<S> => {
  const fx = (args: unknown[]): Fxx<S> =>
    args.length >= lengthLimit ? fn(...args) : _curry(fn, args, lengthLimit - args.length);

  return (...args: unknown[]) => fx([...args0, ...args]);
};

export const curry = <S>(fn: Fx<S>, ...args: unknown[]): Fxx<S> => _curry<S>(fn, args, fn.length);
