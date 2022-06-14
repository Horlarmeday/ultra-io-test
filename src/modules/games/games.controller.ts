import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/responses/message.responses';
import { QueryParamsDto } from '../../common/dto/queryParams.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    const result = await this.gamesService.create(createGameDto);
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Get()
  async findAll(@Query() queryDto: QueryParamsDto) {
    const result = await this.gamesService.findAll(queryDto);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get()
  async processGames() {
    await this.gamesService.processGames();
    return sendSuccessResponse(Messages.PROCESSED, null);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.gamesService.findOne(id);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get(':id/publisher')
  async fetchPublisher(@Param('id') id: string) {
    const result = await this.gamesService.fetchPublisher(id);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    const result = await this.gamesService.update(id, updateGameDto);
    return sendSuccessResponse(Messages.UPDATED, result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.gamesService.delete(id);
    return sendSuccessResponse(Messages.DELETED, result);
  }
}
