import { ApiProperty } from "@nestjs/swagger";

export class Period {
  @ApiProperty()
  start: Date;
  @ApiProperty()
  end: Date;
}
