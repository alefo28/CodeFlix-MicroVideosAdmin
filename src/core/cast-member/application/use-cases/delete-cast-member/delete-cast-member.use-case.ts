import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import { IUsecase } from '@core/shared/application/use-case.interface';

export class DeleteCastMemberUseCase
    implements IUsecase<DeleteCastMemberInput, DeleteCastMemberOutput> {
    constructor(private castMemberRepository: ICastMemberRepository) { }

    async execute(input: DeleteCastMemberInput): Promise<DeleteCastMemberOutput> {
        const castMemberId = new Uuid(input.id);
        await this.castMemberRepository.delete(castMemberId);
    }
}

export type DeleteCastMemberInput = {
    id: string;
};

type DeleteCastMemberOutput = void;