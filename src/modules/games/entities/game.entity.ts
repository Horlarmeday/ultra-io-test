import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Publisher } from './publisher.entity';

@Table
export class Game extends Model {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => Publisher)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  publisher_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  tags: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: Date.now(),
  })
  release_date: Date;

  @BelongsTo(() => Publisher)
  publisher: Publisher;
}
