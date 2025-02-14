import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryInput } from '@core/category/application/use-cases/update-category/update-category.input';

export class UpdateCategoryInputWithoutId extends OmitType(UpdateCategoryInput, ['id'] as const) { }

export class UpdateCategoryDto extends UpdateCategoryInputWithoutId { }
