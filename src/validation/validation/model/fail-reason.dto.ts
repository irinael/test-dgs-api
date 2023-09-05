import { ApiProperty } from '@nestjs/swagger';
import { Movement } from './movement.dto';
import { Period } from './period.dto';
import { type } from 'os';

export class FailReason {
  @ApiProperty({ type: Period })
  period: Period;
  @ApiProperty()
  message: string;
  @ApiProperty()
  amountOff: number;
  @ApiProperty({ type: [Movement] })
  duplicatedMovements: Movement[];
}
