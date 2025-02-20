import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { EntityValidationError } from '@core/shared/domain/validators/validator.error';
import { IUsecase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { CastMemberType } from '../../../domain/cast-member-type.vo';

import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import {
    CastMemberOutput,
    CastMemberOutputMapper,
} from '../common/cast-member-output';
import { UpdateCastMemberInput } from './update-cast-member.input';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';

export class UpdateCastMemberUseCase
    implements IUsecase<UpdateCastMemberInput, UpdateCastMemberOutput> {
    constructor(private castMemberRepo: ICastMemberRepository) { }

    async execute(input: UpdateCastMemberInput): Promise<UpdateCastMemberOutput> {
        const castMemberId = new Uuid(input.id);
        const castMember = await this.castMemberRepo.findById(castMemberId);

        if (!castMember) {
            throw new NotFoundError(input.id, CastMember);
        }

        input.name && castMember.changeName(input.name);

        if (input.type) {
            const [type, errorCastMemberType] = CastMemberType.create(
                input.type,
            ).asArray();

            castMember.changeType(type);

            errorCastMemberType &&
                castMember.notification.setError(errorCastMemberType.message, 'type');
        }

        if (castMember.notification.hasErrors()) {
            throw new EntityValidationError(castMember.notification.toJSON());
        }

        await this.castMemberRepo.update(castMember);

        return CastMemberOutputMapper.toOutput(castMember);
    }
}

export type UpdateCastMemberOutput = CastMemberOutput;