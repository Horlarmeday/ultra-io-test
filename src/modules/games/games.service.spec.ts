import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { CreateGameDto } from './dto/create-game.dto';
import { QueryParamsDto } from '../../common/dto/queryParams.dto';
import { NotFoundException } from '@nestjs/common';
import { Messages } from '../../core/responses/message.responses';
import { UpdateGameDto } from './dto/update-game.dto';

describe('GamesService', () => {
  let service: GamesService;

  const createGamesDto: CreateGameDto = {
    price: 2000,
    title: 'Candy Crush',
    tags: ['Crush', 'Game'],
    release_date: new Date('2020-09-07'),
    name: 'Tony Paul',
    siret: 1234567890123456,
    phone: '2347035120699',
  };

  const updateGameDto: UpdateGameDto = {
    ...createGamesDto,
  };

  const queryDto: QueryParamsDto = {
    currentPage: 1,
    pageLimit: 10,
  };

  const mockGamesRepository = {
    create: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: '13224',
        ...dto,
      }),
    ),
    findAll: jest.fn(),
    fetchPublisher: jest.fn().mockReturnValue(
      Promise.resolve({
        id: '13224',
        ...createGamesDto,
        publisher: {},
      }),
    ),
    restructureGameResponse: jest.fn().mockReturnValue({
      id: '13224',
      ...createGamesDto,
    }),
    delete: jest.fn().mockReturnValue(Promise.resolve(1)),
    update: jest.fn((dto, id) => {
      return Promise.resolve({
        id: id,
        ...createGamesDto,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneralHelpers,
        GamesService,
        {
          provide: GamesService,
          useValue: mockGamesRepository,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a game', async () => {
    expect(await service.create(createGamesDto)).toEqual({
      id: expect.any(String),
      ...createGamesDto,
    });
    expect(mockGamesRepository.create).toHaveBeenCalledWith(createGamesDto);
  });

  it('should get all paginated games', async () => {
    expect(await service.findAll(queryDto)).toEqual(
      expect.not.objectContaining(queryDto),
    );
  });

  it('should get a publisher data', async () => {
    expect(await service.fetchPublisher('13224')).toEqual({
      ...createGamesDto,
      id: expect.any(String),
      publisher: {},
    });
    expect(mockGamesRepository.fetchPublisher).toHaveBeenCalled();
  });

  it('should throw error if a game is not found', async () => {
    try {
      await service.fetchPublisher('');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe(Messages.NOT_FOUND);
    }
  });

  it('should delete a game', async () => {
    expect(await service.delete('13224')).toEqual(1);
    expect(mockGamesRepository.delete).toHaveBeenCalled();
  });
});
