import { IsDate, IsNumber } from 'class-validator';

export class Checkpoint {
  @IsDate()
  date: Date;
  @IsNumber()
  balance: number;
}
