import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { GameJobProcessor } from './game-job.processor';
import { Game } from '../../../modules/games/entities/game.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameJobService } from './game-job.producer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'game',
    }),
    SequelizeModule.forFeature([Game]),
  ],
  providers: [GameJobProcessor, GameJobService],
  exports: [GameJobService],
})
export class GameJobModule {}
