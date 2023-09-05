import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsNotEmptyObject, IsString, MinLength } from 'class-validator';
import { Checkpoint } from './validation/model/checkpoint.dto';
import { Movement } from './validation/model/movement.dto';

export class ValidationRequest {
 
  @ArrayMinSize(1)
  movements: Movement[];
  
  @ArrayMinSize(2)
  checkpoints: Checkpoint[];
}
