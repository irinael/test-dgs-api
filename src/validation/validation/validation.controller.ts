import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { ValidationRequest } from '../validation-request.dto';
import { ValidationService } from './validation.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ValidationResponse } from './model/validation-response.dto';

@ApiTags('movements')
@Controller('movements/validation')
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);
  constructor(private readonly validationService: ValidationService) {}
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Validate bank movements according to a provided list of checkpoints',
    description:
      'Checks if the sum of movements (at least 1) is equal to the expected balance for a period of time (at least two checkpoints expected). \n\nThe response is an object with the status of the validation (OK/KO) and, if necessary, a list of failure reasons',
  })
  @ApiBody({ type: ValidationRequest })
  @ApiResponse({
    status: 200,
    type: ValidationResponse,
    description: 'ValidationResponse',
  })
  @ApiBadRequestResponse({
    description:
      'Movements must contain at least 1 elements. Checkpoints must contain at least 2 elements.\n\nAll movements mus be in the period defined by the checkpoints.',
  })
  async validateMovements(
    @Body() validationRequest: ValidationRequest,
  ): Promise<ValidationResponse> {
    this.logger.log(
      `Validating movements: ${JSON.stringify(validationRequest.movements)}`,
    );

    return this.validationService.validateMovements(
      validationRequest.movements,
      validationRequest.checkpoints,
    );
  }
}
