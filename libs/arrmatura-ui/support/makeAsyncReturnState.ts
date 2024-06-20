export function makeAsyncReturnState(fn, { busyProp = "busy", targetProp = "..." } = {}) {
  return {
    [busyProp]: true,
    error: null,
    [targetProp]: fn()
      .catch((error) => ({ [busyProp]: false, error }))
      .then((result) => ({ [busyProp]: false, ...result })),
  };
}
