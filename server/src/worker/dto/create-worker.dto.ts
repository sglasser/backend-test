import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWorkerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @MinLength(1)
  username: string;

  @IsNotEmpty()
  @IsNumber()
  hourly_wage: number;
}
