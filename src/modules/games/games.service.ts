import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { QueryParamsDto } from '../../common/dto/queryParams.dto';
import { Publisher } from './entities/publisher.entity';
import { Messages } from '../../core/responses/message.responses';
import { GameJobService } from '../../core/jobs/game/game-job.producer';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);
  constructor(
    @InjectModel(Game) private gamesRepository: typeof Game,
    private readonly generalHelpers: GeneralHelpers,
    private readonly gameJobService: GameJobService,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    return await this.gamesRepository.create<Game>({ ...createGameDto });
  }

  async findAll(queryDto: QueryParamsDto): Promise<{
    total: number;
    pages: number;
    perPage: number;
    docs: Game[];
    currentPage: number;
  }> {
    const { currentPage, pageLimit } = queryDto;

    const { limit, offset } = this.generalHelpers.getPagination(
      +currentPage,
      +pageLimit,
    );

    const applications = await this.getGames(limit, offset);

    return this.generalHelpers.paginate(applications, currentPage, limit);
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.gamesRepository.findOne<Game>({ where: { id } });
    if (!game) throw new NotFoundException(Messages.NOT_FOUND);
    return game;
  }

  async fetchPublisher(id: string) {
    return await this.gamesRepository.findOne<Game>({
      where: { id },
      include: [
        {
          model: Publisher,
        },
      ],
    });
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<unknown> {
    return this.gamesRepository.update<Game>(
      { ...updateGameDto },
      { where: { id } },
    );
  }

  async delete(id: string): Promise<number> {
    return await this.gamesRepository.destroy<Game>({
      where: { id },
      force: true,
    });
  }

  async processGames() {
    await this.gameJobService.addJobToQueue();
    this.logger.log('Remove games added to jobs');
  }

  private async getGames(
    limit: number,
    offset: number,
  ): Promise<{ rows: Game[]; count: number }> {
    return await this.gamesRepository.findAndCountAll<Game>({
      limit: limit,
      offset: offset,
      include: [
        {
          model: Publisher,
        },
      ],
    });
  }
}
