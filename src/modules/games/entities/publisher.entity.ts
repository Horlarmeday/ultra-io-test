import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

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
    type: DataType.INTEGER,
    allowNull: false,
  })
  siret: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;
}
