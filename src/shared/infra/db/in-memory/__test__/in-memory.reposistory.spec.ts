import { Entity } from "../../../../domain/entity";
import { NotFoundError } from "../../../../domain/errors/not-found.error";
import { ValueObject } from "../../../../domain/value-object";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "../in-memory.repository";

type StubEntityProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};
class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityProps) {
    super();
    this.entity_id = props.entity_id;
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.toString(),
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => any {
    return StubEntity;
  }
}

describe("In Memory Repository Unit Tests", () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  it("should create a new entity", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 10,
    });

    await repo.insert(entity);

    expect(repo.items.length).toBe(1);
    expect(repo.items[0].toJSON()).toEqual(entity.toJSON());
  });

  test("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: "Test1",
        price: 10,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: "Test2",
        price: 20,
      }),
    ];

    await repo.bulkInsert(entities);

    expect(repo.items.length).toBe(2);
    expect(repo.items[0].toJSON()).toEqual(entities[0].toJSON());
    expect(repo.items[1].toJSON()).toEqual(entities[1].toJSON());
  });

  test("should update an entity", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 10,
    });

    await repo.insert(entity);

    entity.name = "Updated";
    entity.price = 20;

    await repo.update(entity);

    expect(repo.items.length).toBe(1);
    expect(repo.items[0].toJSON()).toEqual(entity.toJSON());
  });

  test("should throw an error if entity is not found", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 10,
    });

    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  test("should delete an entity", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 10,
    });

    await repo.insert(entity);

    await repo.delete(entity.entity_id);

    expect(repo.items.length).toBe(0);
  });

  test("should find an entity by id", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 10,
    });

    await repo.insert(entity);

    const found = await repo.findById(entity.entity_id);

    expect(found.toJSON()).toEqual(entity.toJSON());
  });

  test("should return null if entity is not found", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 10,
    });

    await repo.insert(entity);

    const found = await repo.findById(new Uuid());

    expect(found).toBeNull();
  });

  test("should return all entities", async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: "Test1",
        price: 10,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: "Test2",
        price: 20,
      }),
    ];

    await repo.bulkInsert(entities);

    const found = await repo.findAll();

    expect(found.length).toBe(2);
    expect(found[0].toJSON()).toEqual(entities[0].toJSON());
    expect(found[1].toJSON()).toEqual(entities[1].toJSON());
  });
});
