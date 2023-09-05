import { Test, TestingModule } from '@nestjs/testing';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';
import { Status } from './model/status.enum';
import { Checkpoint } from './model/checkpoint.dto';
import { Movement } from './model/movement.dto';

describe('ValidationController', () => {
  let controller: ValidationController;
  let service: ValidationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidationController],
      providers: [ValidationService],
    }).compile();

    controller = module.get<ValidationController>(ValidationController);
    service = module.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call validation service - status OK', async () => {
    jest.spyOn(service, 'validateMovements').mockImplementation(() => {
      return { status: Status.OK };
    });

    const response = await controller.validateMovements({
      movements,
      checkpoints,
    });
    expect(response).toEqual({ status: Status.OK });
    expect(service.validateMovements).toHaveBeenCalledWith(
      movements,
      checkpoints,
    );
  });
  it('should call validation service - status KO', async () => {
    const expectedFailReasons = [
      {
        period: {
          start: checkpoints[2].date,
          end: checkpoints[3].date,
        },
        message: 'Opérations débit dupliquées ou opérations crédit manquantes',
        amountOff: -100,
        duplicatedMovements: [],
      },
    ];
    jest.spyOn(service, 'validateMovements').mockImplementation(() => {
      return {
        status: Status.KO,
        failReasons: expectedFailReasons,
      };
    });

    const response = await controller.validateMovements({
      movements: failingMovements,
      checkpoints,
    });
    expect(response).toEqual({
      status: Status.KO,
      failReasons: expectedFailReasons,
    });
    expect(service.validateMovements).toHaveBeenCalledWith(
      failingMovements,
      checkpoints,
    );
  });
});

//given movements in a year
const movements: Movement[] = [
  { id: 1, date: new Date('2020-1-2 GMT'), wording: 'op1', amount: 500 },
  { id: 2, date: new Date('2020-1-15 GMT'), wording: 'op2', amount: -200 },
  { id: 3, date: new Date('2020-1-30 GMT'), wording: 'op3', amount: 300 },
  { id: 4, date: new Date('2020-2-22 GMT'), wording: 'op4', amount: -100 },
  { id: 5, date: new Date('2020-3-22 GMT'), wording: 'op5', amount: 1000 },
  { id: 6, date: new Date('2020-4-22 GMT'), wording: 'op6', amount: -100 },
  { id: 7, date: new Date('2020-5-22 GMT'), wording: 'op7', amount: 800 },
  { id: 8, date: new Date('2020-6-22 GMT'), wording: 'op8', amount: -900 },
  { id: 8, date: new Date('2020-7-22 GMT'), wording: 'op9', amount: 500 },
  { id: 8, date: new Date('2020-8-22 GMT'), wording: 'op10', amount: -200 },
  { id: 9, date: new Date('2020-9-22 GMT'), wording: 'op11', amount: -900 },
  {
    id: 10,
    date: new Date('2020-10-22 GMT'),
    wording: 'op12',
    amount: 900,
  },
  {
    id: 11,
    date: new Date('2020-11-22 GMT'),
    wording: 'op13',
    amount: 900,
  },
  {
    id: 12,
    date: new Date('2020-12-22 GMT'),
    wording: 'op14',
    amount: 600,
  },
];
const failingMovements: Movement[] = [
  { id: 1, date: new Date('2020-1-2 GMT'), wording: 'op1', amount: 500 },
  { id: 2, date: new Date('2020-1-15 GMT'), wording: 'op2', amount: -200 },
  { id: 3, date: new Date('2020-1-30 GMT'), wording: 'op3', amount: 300 },
  { id: 5, date: new Date('2020-3-22 GMT'), wording: 'op5', amount: 1000 },
  { id: 6, date: new Date('2020-4-22 GMT'), wording: 'op6', amount: -100 },
  { id: 7, date: new Date('2020-5-22 GMT'), wording: 'op7', amount: 800 },
  { id: 8, date: new Date('2020-6-22 GMT'), wording: 'op8', amount: -900 },
  { id: 8, date: new Date('2020-7-22 GMT'), wording: 'op9', amount: 500 },
  { id: 8, date: new Date('2020-8-22 GMT'), wording: 'op10', amount: -200 },
  { id: 9, date: new Date('2020-9-22 GMT'), wording: 'op11', amount: -900 },
  {
    id: 10,
    date: new Date('2020-10-22 GMT'),
    wording: 'op12',
    amount: 900,
  },
  {
    id: 11,
    date: new Date('2020-11-22 GMT'),
    wording: 'op13',
    amount: 900,
  },
  {
    id: 12,
    date: new Date('2020-12-22 GMT'),
    wording: 'op14',
    amount: 600,
  },
];

//given checkpoints
const checkpoints: Checkpoint[] = [
  { date: new Date('2020-1-1 GMT'), balance: 200 },
  { date: new Date('2020-2-1 GMT'), balance: 800 },
  { date: new Date('2020-3-1 GMT'), balance: 700 },
  { date: new Date('2020-4-1 GMT'), balance: 1700 },
  { date: new Date('2020-5-1 GMT'), balance: 1600 },
  { date: new Date('2020-6-1 GMT'), balance: 2400 },
  { date: new Date('2020-7-1 GMT'), balance: 1500 },
  { date: new Date('2020-8-1 GMT'), balance: 2000 },
  { date: new Date('2020-9-1 GMT'), balance: 1800 },
  { date: new Date('2020-10-1 GMT'), balance: 900 },
  { date: new Date('2020-11-1 GMT'), balance: 1800 },
  { date: new Date('2020-12-1 GMT'), balance: 2700 },
  { date: new Date('2021-2-1 GMT'), balance: 3300 },
];
