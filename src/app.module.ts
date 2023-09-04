import { Module } from '@nestjs/common';
import { ValidationModule } from './validation/validation.module';
import { ValidationController } from './validation/validation/validation.controller';
import { ValidationService } from './validation/validation/validation.service';

@Module({
  imports: [ValidationModule],
  controllers: [ValidationController],
  providers: [ValidationService],
})
export class AppModule {}
