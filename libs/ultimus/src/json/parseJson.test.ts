import { parseJson } from "./parseJson";

 
describe("parseJson", () => {
  it("should parse valid JSON string", () => {
    const jsonString = '{"name": "John", "age": 30}';
    const expectedResult = { name: "John", age: 30 };
    expect(parseJson(jsonString)).toEqual(expectedResult);
  });

  it("should return default value if invalid JSON string is passed", () => {
    const jsonString = '{name": "John", "age": 30}';
    const defaultValue = { name: "Unknown", age: 0 };
    expect(parseJson(jsonString, defaultValue)).toEqual(defaultValue);
  });

  it("should return default value if no JSON string is passed", () => {
    const defaultValue = { name: "Unknown", age: 0 };
    expect(parseJson(undefined, defaultValue)).toEqual(defaultValue);
  });

  it("should return empty object if no JSON string or default value is passed", () => {
    expect(parseJson()).toEqual({});
  });
});
