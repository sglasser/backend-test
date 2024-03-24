import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateLocationDto {
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(1)
  name: string;
}
