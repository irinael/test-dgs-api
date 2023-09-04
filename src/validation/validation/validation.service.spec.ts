import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { Movement } from './model/movement.dto';
import { Checkpoint } from './model/checkpoint.dto';
import { Status } from './model/status.enum';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationService],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check movements in a given months - check OK', () => {
    //given movements on two months
    const movements: Movement[] = [
      { id: 1, date: new Date('2020-1-2 GMT'), wording: 'op1', amount: 500 },
      { id: 2, date: new Date('2020-1-15 GMT'), wording: 'op2', amount: -200 },
      { id: 3, date: new Date('2020-1-30 GMT'), wording: 'op3', amount: 300 },
      { id: 4, date: new Date('2020-2-2 GMT'), wording: 'op4', amount: -100 },
    ];
    //given checkpoints
    const checkPoints: Checkpoint[] = [
      { date: new Date('2020-1-1 GMT'), balance: 0 },
      { date: new Date('2020-2-1 GMT'), balance: 600 },
    ];

    const response = service.validateMovements(movements, checkPoints);

    expect(service).toBeDefined();
    expect(response.status).toBe(Status.OK);
    expect(response.failReasons).toBeUndefined();
  });

  it('should check movements in a given months - check KO', () => {
    //given movements on two months
    const movements: Movement[] = [
      { id: 1, date: new Date('2020-1-2 GMT'), wording: 'op1', amount: 500 },
      { id: 2, date: new Date('2020-1-15 GMT'), wording: 'op2', amount: -200 },
      { id: 3, date: new Date('2020-1-30 GMT'), wording: 'op3', amount: 300 },
      { id: 4, date: new Date('2020-2-2 GMT'), wording: 'op4', amount: -100 },
    ];
    //given checkpoints
    const checkPoints: Checkpoint[] = [
      { date: new Date('2020-1-1 GMT'), balance: 0 },
      { date: new Date('2020-2-1 GMT'), balance: 700 },
    ];

    const response = service.validateMovements(movements, checkPoints);

    expect(service).toBeDefined();
    expect(response.status).toBe(Status.KO);

    expect(response.failReasons).toContainEqual({
      period: {
        start: checkPoints[0].date,
        end: checkPoints[1].date,
      },
      message: 'Opérations crédit manquantes ou opérations débit dupliquées',
      amountOff: -100,
      duplicatedMovements: [],
    });
  });

  it('should check movements in a given year - check OK', () => {
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

    //given checkpoints
    const checkPoints: Checkpoint[] = [
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

    const response = service.validateMovements(movements, checkPoints);

    expect(service).toBeDefined();
    expect(response.status).toBe(Status.OK);
    expect(response.failReasons).toBeUndefined;
  });

  it('should check movements in a given year - check KO - missing movement', () => {
    //given movements in a year with on missing in december
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

    //given checkpoints
    const checkPoints: Checkpoint[] = [
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
      { date: new Date('2021-2-1 GMT'), balance: 3500 },
    ];

    const response = service.validateMovements(movements, checkPoints);

    expect(service).toBeDefined();
    expect(response.status).toBe(Status.KO);
    console.log(response.failReasons);
    expect(response.failReasons).toContainEqual({
      period: {
        start: checkPoints[11].date,
        end: checkPoints[12].date,
      },
      message: 'Opérations crédit manquantes ou opérations débit dupliquées',
      amountOff: -200,
      duplicatedMovements: [],
    });
  });

  it('should check movements in a given year - check KO - duplicated movement', () => {
    //given movements in a year with one duplicated in january
    const movements: Movement[] = [
      { id: 1, date: new Date('2020-1-2 GMT'), wording: 'op1', amount: 500 },
      { id: 2, date: new Date('2020-1-15 GMT'), wording: 'op2', amount: -200 },
      { id: 3, date: new Date('2020-1-30 GMT'), wording: 'op3', amount: 300 },
      { id: 3, date: new Date('2020-1-30 GMT'), wording: 'op3', amount: 300 },
    ];

    //given checkpoints
    const checkPoints: Checkpoint[] = [
      { date: new Date('2020-1-1 GMT'), balance: 200 },
      { date: new Date('2020-2-1 GMT'), balance: 800 },
    ];

    const response = service.validateMovements(movements, checkPoints);

    expect(service).toBeDefined();
    expect(response.status).toBe(Status.KO);
    expect(response.failReasons).toContainEqual({
      period: {
        start: checkPoints[0].date,
        end: checkPoints[1].date,
      },
      message: 'Opérations crédit dupliquées ou opérations débit manquantes',
      amountOff: 300,
      duplicatedMovements: [
        { id: 3, date: new Date('2020-1-30 GMT'), wording: 'op3', amount: 300 },
      ],
    });
  });

  it('should check movements in a given year - check KO - two duplicated movements', () => {
    //given movements in a year with two duplicated in december
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
      {
        id: 12,
        date: new Date('2020-12-22 GMT'),
        wording: 'op14',
        amount: 600,
      },
      {
        id: 13,
        date: new Date('2020-12-22 GMT'),
        wording: 'op14',
        amount: 600,
      },
    ];

    //given checkpoints
    const checkPoints: Checkpoint[] = [
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

    const response = service.validateMovements(movements, checkPoints);

    expect(service).toBeDefined();
    expect(response.status).toBe(Status.KO);
    expect(response.failReasons).toContainEqual({
      period: {
        start: checkPoints[11].date,
        end: checkPoints[12].date,
      },
      message: 'Opérations crédit dupliquées ou opérations débit manquantes',
      amountOff: 1200,
      duplicatedMovements: [
        {
          id: 12,
          date: new Date('2020-12-22 GMT'),
          wording: 'op14',
          amount: 600,
        },
        {
          id: 13,
          date: new Date('2020-12-22 GMT'),
          wording: 'op14',
          amount: 600,
        },
      ],
    });
  });
  it('should check movements in a given year - check KO - duplicated movements in different periods', () => {
    //given movements in a year with one duplicated in march and two in december
    const movements: Movement[] = [
      { id: 1, date: new Date('2020-1-2 GMT'), wording: 'op1', amount: 500 },
      { id: 2, date: new Date('2020-1-15 GMT'), wording: 'op2', amount: -200 },
      { id: 3, date: new Date('2020-1-30 GMT'), wording: 'op3', amount: 300 },
      { id: 4, date: new Date('2020-2-22 GMT'), wording: 'op4', amount: -100 },
      { id: 5, date: new Date('2020-3-22 GMT'), wording: 'op5', amount: 1000 },
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
      {
        id: 12,
        date: new Date('2020-12-22 GMT'),
        wording: 'op14',
        amount: 600,
      },
      {
        id: 13,
        date: new Date('2020-12-22 GMT'),
        wording: 'op14',
        amount: 600,
      },
    ];

    //given checkpoints
    const checkPoints: Checkpoint[] = [
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

    const response = service.validateMovements(movements, checkPoints);

    expect(service).toBeDefined();
    expect(response.status).toBe(Status.KO);
    expect(response.failReasons).toContainEqual({
      period: {
        start: checkPoints[2].date,
        end: checkPoints[3].date,
      },
      message: 'Opérations crédit dupliquées ou opérations débit manquantes',
      amountOff: 1000,
      duplicatedMovements: [
        {
          id: 5,
          date: new Date('2020-3-22 GMT'),
          wording: 'op5',
          amount: 1000,
        },
      ],
    });
    expect(response.failReasons).toContainEqual({
      period: {
        start: checkPoints[11].date,
        end: checkPoints[12].date,
      },
      message: 'Opérations crédit dupliquées ou opérations débit manquantes',
      amountOff: 1200,
      duplicatedMovements: [
        {
          id: 12,
          date: new Date('2020-12-22 GMT'),
          wording: 'op14',
          amount: 600,
        },
        {
          id: 13,
          date: new Date('2020-12-22 GMT'),
          wording: 'op14',
          amount: 600,
        },
      ],
    });
  });
  it('should check movements in a given year - check KO - duplicated movements and missing operations in the same period', () => {
    //given movements in a year with two duplicated and some missing in december
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
      {
        id: 12,
        date: new Date('2020-12-22 GMT'),
        wording: 'op14',
        amount: 600,
      },
      {
        id: 13,
        date: new Date('2020-12-22 GMT'),
        wording: 'op14',
        amount: 600,
      },
    ];

    //given checkpoints
    const checkPoints: Checkpoint[] = [
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
      { date: new Date('2021-2-1 GMT'), balance: 5700 },
    ];

    const response = service.validateMovements(movements, checkPoints);

    expect(service).toBeDefined();
    expect(response.status).toBe(Status.KO);

    expect(response.failReasons).toContainEqual({
      period: {
        start: checkPoints[11].date,
        end: checkPoints[12].date,
      },
      message: 'Opérations crédit manquantes ou opérations débit dupliquées',
      amountOff: -1200,
      duplicatedMovements: [
        {
          id: 12,
          date: new Date('2020-12-22 GMT'),
          wording: 'op14',
          amount: 600,
        },
        {
          id: 13,
          date: new Date('2020-12-22 GMT'),
          wording: 'op14',
          amount: 600,
        },
      ],
    });
  });
});
