import { Module } from '@nestjs/common';
import { GameJobModule } from './game/game-job.module';

@Module({
  imports: [GameJobModule],
})
export class JobsModule {}
