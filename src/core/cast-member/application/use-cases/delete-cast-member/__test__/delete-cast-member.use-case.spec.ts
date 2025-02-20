
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';

import { DeleteCastMemberUseCase } from '../delete-cast-member.use-case';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory';

describe('DeleteCastMemberUseCase Unit Tests', () => {
    let useCase: DeleteCastMemberUseCase;
    let repository: CastMemberInMemoryRepository;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
        useCase = new DeleteCastMemberUseCase(repository);
    });

    it('should throws error when entity not found', async () => {
        const castMemberId = new Uuid();

        await expect(() =>
            useCase.execute({ id: castMemberId.id }),
        ).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
    });

    it('should delete a cast member', async () => {
        const items = [CastMember.fake().anActor().build()];
        repository.items = items;
        await useCase.execute({
            id: items[0].cast_member_id.id,
        });
        expect(repository.items).toHaveLength(0);
    });
});
