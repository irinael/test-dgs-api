import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsNotEmptyObject, IsString, MinLength } from 'class-validator';
import { Checkpoint } from './validation/model/checkpoint.dto';
import { Movement } from './validation/model/movement.dto';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';

export class ValidationRequest {
  @ApiProperty({ type: [Movement] }) 
  @ArrayMinSize(1)
  movements: Movement[];
  @ApiProperty({ type: [Checkpoint] }) 
  @ArrayMinSize(2)
  checkpoints: Checkpoint[];
}
