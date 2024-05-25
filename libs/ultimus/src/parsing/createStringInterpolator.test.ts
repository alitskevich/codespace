 
import { createStringInterpolator } from "./createStringInterpolator";

describe("createStringInterpolator", () => {
  it("should return the same string when there are no placeholders", () => {
    const result = createStringInterpolator("No placeholders here", () => () => "")();
    expect(result).toEqual("No placeholders here");
  });

  it("should replace a single placeholder with the evaluated expression", () => {
    const result = createStringInterpolator("The answer is {1 + 2}", (expr) => () => eval(expr))();
    expect(result).toEqual("The answer is 3");
  });

  it("should replace multiple placeholders with the evaluated expressions", () => {
    const result = createStringInterpolator("My name is {name} and I am {age} years old", (expr) => {
      const context = { name: "Alice", age: 30 };
      return new Function(`with(this) { return ${expr} }`).bind(context);
    })();
    expect(result).toEqual("My name is Alice and I am 30 years old");
  });

  it("should handle placeholders at the beginning or end of the string", () => {
    const result = createStringInterpolator("{hw} is a common greeting", (expr) => () => expr.toUpperCase())();
    expect(result).toEqual("HW is a common greeting");
  });
});
