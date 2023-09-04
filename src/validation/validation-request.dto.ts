import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';
import { Checkpoint } from './validation/model/checkpoint.dto';
import { Movement } from './validation/model/movement.dto';

export class ValidationRequest {
  @ArrayNotEmpty()
  movements: Movement[];
  @ArrayNotEmpty()
  checkpoints: Checkpoint[];
}
