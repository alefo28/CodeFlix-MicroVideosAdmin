import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CastMemberTypes } from '../../../../domain/cast-member-type.vo';
import { GetCastMemberUseCase } from '../get-cast-membet.use-case';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';


describe('GetCastMemberUseCase Unit Tests', () => {
    let useCase: GetCastMemberUseCase;
    let repository: CastMemberInMemoryRepository;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
        useCase = new GetCastMemberUseCase(repository);
    });

    it('should throws error when entity not found', async () => {
        const castMemberId = new Uuid();
        await expect(() =>
            useCase.execute({ id: castMemberId.id }),
        ).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
    });

    it('should returns a cast member', async () => {
        const items = [CastMember.fake().anActor().build()];
        repository.items = items;
        const spyFindById = jest.spyOn(repository, 'findById');
        const output = await useCase.execute({ id: items[0].cast_member_id.id });
        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: items[0].cast_member_id.id,
            name: items[0].name,
            type: CastMemberTypes.ACTOR,
            created_at: items[0].created_at,
        });
    });
});