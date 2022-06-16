import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { GameJobProcessor } from './game-job.processor';
import { Game } from '../../../modules/games/entities/game.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameJobService } from './game-job.producer';
import { GeneralHelpers } from '../../../common/helpers/general.helpers';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'game',
    }),
    SequelizeModule.forFeature([Game]),
  ],
  providers: [GameJobProcessor, GameJobService, GeneralHelpers],
  exports: [GameJobService],
})
export class GameJobModule {}
