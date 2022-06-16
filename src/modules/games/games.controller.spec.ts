import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { QueryParamsDto } from '../../common/dto/queryParams.dto';
import { Messages } from '../../core/responses/message.responses';

describe('GamesController', () => {
  let controller: GamesController;

  const createGamesDto: CreateGameDto = {
    price: 2000,
    title: 'Candy Crush',
    tags: ['Crush', 'Game'],
    release_date: new Date('2020-09-07'),
    name: 'Tony Paul',
    siret: 1234567890123456,
    phone: '2347035120699',
  };

  const queryDto: QueryParamsDto = {
    currentPage: 1,
    pageLimit: 10,
  };

  const mockGamesService = {
    create: jest.fn((dto) => {
      return {
        id: '13354',
        ...dto,
      };
    }),
    findAll: jest.fn(),
    fetchPublisher: jest.fn((id) => {
      return {
        id,
        ...createGamesDto,
        publisher: {},
      };
    }),
    update: jest.fn((id) => {
      return {
        id,
        ...createGamesDto,
      };
    }),
    delete: jest.fn((id) => {
      return 1;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [GamesService],
    })
      .overrideProvider(GamesService)
      .useValue(mockGamesService)
      .compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a game', async () => {
    expect(await controller.create(createGamesDto)).toEqual({
      message: Messages.CREATED,
      result: {
        ...createGamesDto,
        id: expect.any(String),
      },
    });
    expect(mockGamesService.create).toHaveBeenCalledWith(createGamesDto);
  });

  it('should get all games', async () => {
    expect(await controller.findAll(queryDto)).toEqual(
      expect.not.objectContaining(queryDto),
    );
  });

  it('should get a publisher data', async () => {
    expect(await controller.fetchPublisher('13354')).toEqual({
      message: Messages.RETRIEVED,
      result: {
        ...createGamesDto,
        id: expect.any(String),
        publisher: {},
      },
    });
    expect(mockGamesService.fetchPublisher).toHaveBeenCalledWith('13354');
  });

  it('should update a game', async () => {
    expect(await controller.update('13224', createGamesDto)).toEqual({
      message: Messages.UPDATED,
      result: {
        id: '13224',
        ...createGamesDto,
      },
    });
    expect(mockGamesService.update).toHaveBeenCalledWith(
      '13224',
      createGamesDto,
    );
  });

  it('should delete a game', async () => {
    expect(await controller.delete('13354')).toEqual({
      message: Messages.DELETED,
      result: 1,
    });
    expect(mockGamesService.delete).toHaveBeenCalledWith('13354');
  });
});
