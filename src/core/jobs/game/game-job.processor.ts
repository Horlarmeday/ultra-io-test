import { Process, Processor } from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from '../../../modules/games/entities/game.entity';
import { Op } from 'sequelize';
import moment from 'moment';
import { GeneralHelpers } from '../../../common/helpers/general.helpers';
import { PROCESS_GAMES } from '../../constants';

@Processor('game')
export class GameJobProcessor {
  private readonly logger = new Logger(GameJobProcessor.name);
  constructor(
    @InjectModel(Game) private gameRepository: typeof Game,
    private readonly generalHelpers: GeneralHelpers,
  ) {}

  @Process(PROCESS_GAMES)
  async processGames(job: Job) {
    try {
      await this.removeGames();
      await this.applyDiscountToGames();
      this.logger.debug('Job completed!');
    } catch (e) {
      this.logger.debug(`An error occurred processing job ${e}`);
      throw new InternalServerErrorException(e);
    }
  }

  async removeGames() {
    this.logger.debug('Start removing games greater than 18 months...');
    await this.gameRepository.destroy({
      where: {
        release_date: {
          [Op.lt]: moment().subtract(18, 'months').toDate(),
        },
      },
    });
    this.logger.debug('Finished removing 18 months ago games completed!');
  }

  async applyDiscountToGames() {
    const startDate = moment().subtract(18, 'months').toDate();
    const endDate = moment().subtract(12, 'months').toDate();

    this.logger.debug('Getting games between 12 and 18 months...');
    const gamesBetween12And18Months = await this.gameRepository.findAll({
      where: {
        release_date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    await this.generalHelpers.processArray(
      gamesBetween12And18Months,
      this.delayedLog,
    );
    this.logger.debug(
      `Finished applying 20% discount to ${gamesBetween12And18Months.length} games`,
    );
  }

  async delayedLog(game: Game) {
    // we can await a function that returns a promise
    await this.delay();
    game.price = this.generalHelpers.applyDiscount(game.price);
    await game.save();
  }

  delay() {
    return new Promise((resolve) => setTimeout(resolve, 300));
  }
}
