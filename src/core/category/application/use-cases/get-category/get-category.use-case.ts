import { IUsecase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput } from "../common/category-output";

export class GetCategoryUseCase
  implements IUsecase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}
  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepo.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    return {
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    };
  }
}

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = CategoryOutput;
