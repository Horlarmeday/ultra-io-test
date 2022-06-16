import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { QueryParamsDto } from '../../common/dto/queryParams.dto';
import { Publisher } from './entities/publisher.entity';
import { Messages } from '../../core/responses/message.responses';
import { GameJobService } from '../../core/jobs/game/game-job.producer';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);
  constructor(
    @InjectModel(Game) private gamesRepository: typeof Game,
    @InjectModel(Publisher) private publishersRepository: typeof Publisher,
    private readonly generalHelpers: GeneralHelpers,
    private readonly gameJobService: GameJobService,
    private sequelize: Sequelize,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const { name, phone, siret, price, release_date, tags, title } =
      createGameDto;
    try {
      return await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const publisher = await this.publishersRepository.create<Publisher>(
          { name, phone, siret },
          transactionHost,
        );
        this.logger.log(`Publisher ${publisher.id} created successfully`);
        return await this.gamesRepository.create<Game>(
          { price, release_date, tags, title, publisher_id: publisher.id },
          transactionHost,
        );
      });
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  async fetchPublisher(id: string) {
    const game = await this.gamesRepository.findOne<Game>({
      where: { id },
      attributes: ['id'],
      include: [
        {
          model: Publisher,
        },
      ],
    });
    if (!game) throw new NotFoundException(Messages.NOT_FOUND);
    return game;
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.gamesRepository.update<Game>(updateGameDto, {
      where: { id },
      returning: true,
    });
    return GamesService.restructureGameResponse(game);
  }

  private static restructureGameResponse(game: [number, Game[]]) {
    return game?.[1]?.[0];
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
    });
  }
}
