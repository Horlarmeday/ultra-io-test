import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaxNumberLength, MinNumberLength } from '../../../core/decorators';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @Type(() => Date)
  readonly release_date: Date;

  @IsOptional()
  readonly tags?: string[];

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsNumber()
  @MaxNumberLength({ message: 'siret cannot be more than 16 digits' })
  @MinNumberLength({ message: 'siret cannot be less than 14 digits' })
  readonly siret: number;
}
