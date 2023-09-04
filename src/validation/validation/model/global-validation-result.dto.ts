import { Status } from './status.enum';
import { FailReason } from './fail-reason.dto';

export interface GlobalValidationResult {
  status: Status;
  failReasons?: FailReason[];
}
