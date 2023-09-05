import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Movement } from './model/movement.dto';
import { Checkpoint } from './model/checkpoint.dto';
import { ValidationResponse } from './model/validation-response.dto';
import { Status } from './model/status.enum';
import { FailReason } from './model/fail-reason.dto';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  validateMovements(
    movementsToValidate: Movement[],
    checkPoints: Checkpoint[],
  ): ValidationResponse {
    const movementsOutOfPeriod = movementsToValidate.filter((movement) => {
      return (
        movement.date < checkPoints[0].date ||
        movement.date > checkPoints[checkPoints.length - 1].date
      );
    });

    if (movementsOutOfPeriod.length > 0) {
      this.manageMovementsOutOfPeriod(movementsOutOfPeriod);

      movementsToValidate = movementsToValidate.filter(
        (movement) => !movementsOutOfPeriod.includes(movement),
      );
    }

    const validationResults = this.computeValidationResults(
      movementsToValidate,
      checkPoints,
    );

    this.logger.log(
      `Validation completed with results: ${JSON.stringify(validationResults)}`,
    );

    return this.agregateValidationResults(validationResults);
  }

  private manageMovementsOutOfPeriod(movementsOutOfPeriod: Movement[]): void {
    const movementsOutOfPeriodIds = movementsOutOfPeriod.map(
      (movement) => movement.id,
    );
    throw new BadRequestException(
      `Movements with following ids are out of analyzed period: ${movementsOutOfPeriodIds}`,
    );
  }

  private computeValidationResults(
    movements: Movement[],
    checkPoints: Checkpoint[],
  ): ValidationResult[] {
    const validationResults: ValidationResult[] = [];

    for (let i = 0; i < checkPoints.length - 1; i++) {
      const movementsToValidateInPeriod = movements.filter(
        (movement) =>
          movement.date >= checkPoints[i].date &&
          movement.date < checkPoints[i + 1].date,
      );

      const cumulatedAmountInPeriod = movementsToValidateInPeriod.reduce(
        (total, movement) => total + movement.amount,
        0,
      );

      const validationResultForPeriod = this.computeValidationResultForPeriod(
        movementsToValidateInPeriod,
        cumulatedAmountInPeriod,
        checkPoints[i],
        checkPoints[i + 1],
      );

      validationResults.push(validationResultForPeriod);
    }
    return validationResults;
  }

  private computeValidationResultForPeriod(
    movements: Movement[],
    movementsAmount: number,
    chackpointA: Checkpoint,
    checkpointB: Checkpoint,
  ): ValidationResult {
    this.logger.log(
      `Validating movements from : ${chackpointA.date} to ${checkpointB.date}`,
    );
    const expectedBalanceForPeriod = checkpointB.balance - chackpointA.balance;
    const isMatchingBalance = movementsAmount === expectedBalanceForPeriod;

    if (isMatchingBalance) {
      this.logger.log(
        `Movements from : ${chackpointA.date} to ${checkpointB.date} are valid`,
      );
      return { isOK: true };
    }

    this.logger.log(
      `Movements from : ${chackpointA.date} to ${checkpointB.date} are not valid`,
    );

    return {
      isOK: false,
      failReason: {
        period: { start: chackpointA.date, end: checkpointB.date },
        message: this.getErrorMessage(
          movementsAmount,
          expectedBalanceForPeriod,
        ),
        amountOff: movementsAmount - expectedBalanceForPeriod,
        duplicatedMovements: this.getDuplicatedMovements(movements),
      },
    };
  }

  private getErrorMessage(totalOperations: number, balance: number): string {
    if (totalOperations < balance) {
      return 'Opérations crédit manquantes ou opérations débit dupliquées';
    } else if (totalOperations > balance) {
      return 'Opérations crédit dupliquées ou opérations débit manquantes';
    } else {
      return 'Une erreur lors de la validation des opérations';
    }
  }

  private getDuplicatedMovements(movements: Movement[]): Movement[] {
    const readMovements = new Set();
    const duplicatedMovements: Movement[] = [];

    for (const movement of movements) {
      const identityCriteriaKey = `${movement.date}-${movement.wording}-${movement.amount}`;
      if (readMovements.has(identityCriteriaKey)) {
        duplicatedMovements.push(movement);
      } else {
        readMovements.add(identityCriteriaKey);
      }
    }

    this.logger.log(
      `${duplicatedMovements.length} duplicated movement(s) found`,
    );

    return duplicatedMovements;
  }

  private agregateValidationResults(
    validationResults: ValidationResult[],
  ): ValidationResponse {
    if (validationResults.every((result) => result.isOK)) {
      return { status: Status.OK };
    }
    return {
      status: Status.KO,
      failReasons: validationResults.map((result) => result.failReason),
    };
  }
}

export interface ValidationResult {
  isOK: boolean;
  failReason?: FailReason;
}
