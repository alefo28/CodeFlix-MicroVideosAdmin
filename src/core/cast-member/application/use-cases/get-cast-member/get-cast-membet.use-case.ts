
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { IUsecase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';

import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import {
    CastMemberOutput,
    CastMemberOutputMapper,
} from '../common/cast-member-output';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';

export class GetCastMemberUseCase
    implements IUsecase<GetCastMemberInput, GetCastMemberOutput> {
    constructor(private castMemberRepo: ICastMemberRepository) { }

    async execute(input: GetCastMemberInput): Promise<GetCastMemberOutput> {
        const castMemberId = new Uuid(input.id);
        const castMember = await this.castMemberRepo.findById(castMemberId);
        if (!castMember) {
            throw new NotFoundError(input.id, CastMember);
        }

        return CastMemberOutputMapper.toOutput(castMember);
    }
}

export type GetCastMemberInput = {
    id: string;
};

export type GetCastMemberOutput = CastMemberOutput;
