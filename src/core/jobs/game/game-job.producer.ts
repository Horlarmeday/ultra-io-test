import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { PROCESS_GAMES } from '../../constants';

@Injectable()
export class GameJobService {
  constructor(@InjectQueue('game') private gameQueue: Queue) {}

  async addJobToQueue() {
    await this.gameQueue.add(PROCESS_GAMES, { delay: 3000 });
  }
}
