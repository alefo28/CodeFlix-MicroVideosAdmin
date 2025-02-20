import { IUsecase } from "@core/shared/application/use-case.interface";
import { CreateCastMemberInput } from "./create-cast-member.input";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository";
import { EntityValidationError } from "@core/shared/domain/validators/validator.error";
import { CastMemberOutput, CastMemberOutputMapper } from "../common/cast-member-output";
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo";

export class CreateCastMemberUseCase
    implements IUsecase<CreateCastMemberInput, CreateCastMemberOutput> {
    constructor(private readonly castMemberRepo: ICastMemberRepository) { }

    async execute(input: CreateCastMemberInput): Promise<CreateCastMemberOutput> {
        const [type, errorCastMemberType] = CastMemberType.create(
            input.type,
        ).asArray();

        const entity = CastMember.create({
            ...input,
            type,
        });

        const notification = entity.notification;
        if (errorCastMemberType) {
            notification.setError(errorCastMemberType.message, 'type');
        }
        if (notification.hasErrors()) {
            throw new EntityValidationError(notification.toJSON());
        }

        await this.castMemberRepo.insert(entity);

        return CastMemberOutputMapper.toOutput(entity)
    }
}

export type CreateCastMemberOutput = CastMemberOutput;
