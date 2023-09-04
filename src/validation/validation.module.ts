import { Module } from '@nestjs/common';
import { ValidationService } from './validation/validation.service';
import { ValidationController } from './validation/validation.controller';

@Module({
  providers: [ValidationService],
  controllers: [ValidationController],
})
export class ValidationModule {}
