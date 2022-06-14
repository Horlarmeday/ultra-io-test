import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from './entities/game.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Publisher } from './entities/publisher.entity';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { GameJobModule } from '../../core/jobs/game/game-job.module';

@Module({
  imports: [SequelizeModule.forFeature([Game, Publisher]), GameJobModule],
  controllers: [GamesController],
  providers: [GamesService, GeneralHelpers],
  exports: [SequelizeModule],
})
export class GamesModule {}
