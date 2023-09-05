import { Status } from './status.enum';
import { FailReason } from './fail-reason.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ValidationResponse {
  @ApiProperty({ enum: Status })
  status: Status;
  @ApiProperty({ type: [FailReason] })
  failReasons?: FailReason[];
}
