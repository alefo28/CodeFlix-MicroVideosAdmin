import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';

import { CastMemberTypes } from '../../../../domain/cast-member-type.vo';
import { UpdateCastMemberInput } from '../update-cast-member.input';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberSequelizeRepository, CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';

describe('UpdateCastMemberUseCase Integration Tests', () => {
    let useCase: UpdateCastMemberUseCase;
    let repository: CastMemberSequelizeRepository;

    setupSequelize({ models: [CastMemberModel] });

    beforeEach(() => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new UpdateCastMemberUseCase(repository);
    });

    it('should throws error when entity not found', async () => {
        const castMemberId = new Uuid();
        await expect(() =>
            useCase.execute(
                new UpdateCastMemberInput({ id: castMemberId.id, name: 'fake' }),
            ),
        ).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
    });

    it('should update a cast member', async () => {
        const entity = CastMember.fake().anActor().build();
        await repository.insert(entity);

        let output = await useCase.execute(
            new UpdateCastMemberInput({
                id: entity.cast_member_id.id,
                name: 'test',
                type: CastMemberTypes.ACTOR,
            }),
        );
        expect(output).toStrictEqual({
            id: entity.cast_member_id.id,
            name: 'test',
            type: CastMemberTypes.ACTOR,
            created_at: entity.created_at,
        });

        type Arrange = {
            input: {
                id: string;
                name: string;
                type: CastMemberTypes;
            };
            expected: {
                id: string;
                name: string;
                type: CastMemberTypes;
                created_at: Date;
            };
        };
        const arrange: Arrange[] = [
            {
                input: {
                    id: entity.cast_member_id.id,
                    name: 'test',
                    type: CastMemberTypes.DIRECTOR,
                },
                expected: {
                    id: entity.cast_member_id.id,
                    name: 'test',
                    type: CastMemberTypes.DIRECTOR,
                    created_at: entity.created_at,
                },
            },
        ];

        for (const i of arrange) {
            output = await useCase.execute({
                id: i.input.id,
                name: i.input.name,
                type: i.input.type,
            });
            const entityUpdated = await repository.findById(
                new Uuid(i.input.id),
            );
            expect(output).toStrictEqual({
                id: entity.cast_member_id.id,
                name: i.expected.name,
                type: i.expected.type,
                created_at: i.expected.created_at,
            });
            expect(entityUpdated.toJSON()).toStrictEqual({
                cast_member_id: entity.cast_member_id.id,
                name: i.expected.name,
                type: i.expected.type,
                created_at: i.expected.created_at,
            });
        }
    });
});