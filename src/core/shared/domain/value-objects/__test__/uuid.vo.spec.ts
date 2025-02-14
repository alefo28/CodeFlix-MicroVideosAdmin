import { InvalidUuidError, Uuid } from "../uuid.vo";
import { validate as uuidValidate } from "uuid";

describe("Uuid Unit Test", () => {
  const valideteSpy = jest.spyOn(Uuid.prototype as any, "validate");

  test("should throw error when uuid is invalid", () => {
    expect(() => new Uuid("invalid")).toThrow(new InvalidUuidError());
    expect(valideteSpy).toHaveBeenCalledTimes(1);
  });

  test("should create a uuid with default value", () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(valideteSpy).toHaveBeenCalledTimes(1);
  });

  test("should create a uuid with valid value", () => {
    const uuid = new Uuid("b6c4f0c6-2e1a-4b6b-8e2e-0f2c1f2f8d8a");
    expect(uuid.id).toBe("b6c4f0c6-2e1a-4b6b-8e2e-0f2c1f2f8d8a");
    expect(valideteSpy).toHaveBeenCalledTimes(1);
  });
});
