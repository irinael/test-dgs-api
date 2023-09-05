import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationModule } from './../src/validation/validation.module';
import { ValidationService } from './../src/validation/validation/validation.service';
import { Status } from './../src/validation/validation/model/status.enum';

describe('ValidationController (e2e)', () => {
  let app: INestApplication;

  let validationService = {
    validateMovements: () => ({
      status: Status.OK,
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ValidationModule],
    })
      .overrideProvider(ValidationService)
      .useValue(validationService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST validate movements', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .expect(200)
      .expect({ status: Status.OK });
  });
});
