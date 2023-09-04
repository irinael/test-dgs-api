import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ValidationRequest } from '../validation-request.dto';
import { ValidationService } from './validation.service';

@Controller('movements/validation')
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);
  constructor(private readonly validationService: ValidationService) {}
  @Post()
  async validateMovements(@Body() validationRequest: ValidationRequest) {
    this.logger.log(
      `Validating movements: ${JSON.stringify(validationRequest.movements)}`,
    );

    return this.validationService.validateMovements(
      validationRequest.movements,
      validationRequest.checkpoints,
    );
  }
}
