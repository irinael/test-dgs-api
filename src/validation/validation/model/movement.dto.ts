import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class Movement {
  @ApiProperty()
  @IsNumber()
  id: number;
  @ApiProperty()
  @IsDate()
  date: Date;
  @ApiProperty()
  @IsString()
  wording: string;
  @ApiProperty()
  @IsNumber()
  amount: number;
}
