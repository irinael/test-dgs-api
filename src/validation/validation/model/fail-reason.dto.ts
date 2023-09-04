import { Movement } from './movement.dto';
import { Period } from './period.dto';

export interface FailReason {
  period: Period;
  message: string;
  amountOff: number;
  duplicatedMovements: Movement[];
}
