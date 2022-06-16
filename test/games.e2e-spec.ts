import { INestApplication, LoggerService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Messages } from '../src/core/responses/message.responses';
import { CreateGameDto } from '../src/modules/games/dto/create-game.dto';
import { UpdateGameDto } from '../src/modules/games/dto/update-game.dto';

describe('GamesController (e2e)', () => {
  let app: INestApplication;
  const createGameDto: CreateGameDto = {
    title: 'Angry Birds',
    price: 3000,
    tags: ['birds', 'games'],
    release_date: new Date('2020-09-09'),
    name: 'Mike Cannon',
    siret: 12345678901234,
    phone: '23409087654321',
  };

  const updateGameDto: UpdateGameDto = { title: 'Fruity Foot', price: 500 };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  let gameId;
  it('/games (GET - all games)', async () => {
    const response = await request(app.getHttpServer())
      .get('/games')
      .expect(200);
    expect(response.body.message).toContain(Messages.RETRIEVED);
  });

  it('/games (POST - create a game)', async () => {
    const response = await request(app.getHttpServer())
      .post('/games')
      .send(createGameDto)
      .expect(201);
    const body = response.body;
    gameId = body.result.id;
    expect(body.message).toContain(Messages.CREATED);
    expect(body.result).toHaveProperty('title', createGameDto.title);
    expect(body.result).toHaveProperty('price', createGameDto.price.toFixed(2));
  });

  it('/games (GET - a publisher data)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/games/${gameId}/publisher`)
      .expect(200);
    const body = response.body;
    expect(body.message).toContain(Messages.RETRIEVED);
    expect(body.result.publisher).toHaveProperty('name', createGameDto.name);
    expect(body.result.publisher).toHaveProperty('phone', createGameDto.phone);
  });

  it('/games (GET - should throw not found error)', async () => {
    try {
      const response = await request(app.getHttpServer())
        .get(`/games/123456/publisher`)
        .expect(404);
      const body = response.body;
      expect(body.message).toContain(Messages.NOT_FOUND);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('/games (PATCH - update a game)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/games/${gameId}`)
      .send(updateGameDto)
      .expect(200);
    const body = response.body;
    expect(body.message).toContain(Messages.UPDATED);
    expect(body.result).toHaveProperty('price', updateGameDto.price.toFixed(2));
    expect(body.result).toHaveProperty('title', updateGameDto.title);
  });

  it('/games (DELETE - delete a game)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/games/${gameId}`)
      .expect(200);
    const body = response.body;
    expect(body.message).toContain(Messages.DELETED);
    expect(body.result).toBe(1);
  });
});
