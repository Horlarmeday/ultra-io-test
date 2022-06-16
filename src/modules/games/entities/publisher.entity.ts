import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Game } from './game.entity';

@Table
export class Publisher extends Model {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  siret: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @HasMany(() => Game)
  games: Game[];
}
