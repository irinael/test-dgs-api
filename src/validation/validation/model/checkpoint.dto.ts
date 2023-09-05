import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class Checkpoint {
  @ApiProperty()
  @IsDate()
  date: Date;
  @ApiProperty()
  @IsNumber()
  balance: number;
}
