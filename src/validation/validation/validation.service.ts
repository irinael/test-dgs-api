import { Injectable, Logger } from '@nestjs/common';
import { Movement } from './model/movement.dto';
import { Checkpoint } from './model/checkpoint.dto';
import { GlobalValidationResult } from './model/global-validation-result.dto';
import { Status } from './model/status.enum';
import { FailReason } from './model/fail-reason.dto';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  validateMovements(
    movements: Movement[],
    checkPoints: Checkpoint[],
  ): GlobalValidationResult {
    const validationResults = this.computeValidationResults(
      movements,
      checkPoints,
    );

    this.logger.log(
      `Validation completed with results: ${JSON.stringify(validationResults)}`,
    );

    return this.agregateValidationResults(validationResults);
  }

  private computeValidationResults(movements, checkPoints): ValidationResult[] {
    const validationResults: ValidationResult[] = [];
    // let currentBalance = checkPoints[0].balance;

    for (let i = 0; i < checkPoints.length - 1; i++) {
      const movementsToValidate = movements.filter(
        (movement) =>
          movement.date >= checkPoints[i].date &&
          movement.date < checkPoints[i + 1].date,
      );

      const cumulatedAmount = movementsToValidate.reduce(
        (total, movement) => total + movement.amount,
        0,
      );

      //  currentBalance = cumulatedAmount;

      const validationResultForCheckPoint =
        this.getValidationResultForCheckpoint(
          cumulatedAmount,
          checkPoints[i + 1],
          checkPoints[i],
          movementsToValidate,
        );

      validationResults.push(validationResultForCheckPoint);
    }
    return validationResults;
  }

  private getValidationResultForCheckpoint(
    totalMovements: number,
    checkPoint: Checkpoint,
    previousCheckPoint: Checkpoint,
    movements: Movement[],
  ): ValidationResult {
    const expectedBalanceForPeriode =
      checkPoint.balance - previousCheckPoint.balance;
    const isMatchingBalance = totalMovements === expectedBalanceForPeriode;

    if (isMatchingBalance) {
      return { status: true };
    }

    return {
      status: false,
      failReason: {
        period: { start: previousCheckPoint.date, end: checkPoint.date },
        message: this.getErrorMessage(
          totalMovements,
          expectedBalanceForPeriode,
        ),
        amountOff: totalMovements - expectedBalanceForPeriode,
        duplicatedMovements: this.getDuplicatedMovements(movements),
      },
    };
  }

  private getErrorMessage(totalOperations: number, balance: number): string {
    if (totalOperations < balance) {
      return 'Une ou des opérations manquantes sur cette période';
    } else if (totalOperations > balance) {
      return 'Le montant des opérations est supérieur au solde attendu';
    } else {
      return 'Une erreur lors de la validation des opérations';
    }
  }

  private getDuplicatedMovements(movements: Movement[]): Movement[] {
    // check if an identical movement exists in the array at a different index then the current one
    return movements.filter((movement, index, arr) => {
      const currentIndex = arr.findIndex(
        (m, i) =>
          i !== index && // Ne pas comparer le mouvement avec lui-même
          m.date === movement.date &&
          m.wording === movement.wording &&
          m.amount === movement.amount,
      );
      return currentIndex !== -1;
    });
  }

  private agregateValidationResults(
    validationResults: ValidationResult[],
  ): GlobalValidationResult {
    if (validationResults.every((result) => result.status)) {
      return { status: Status.OK };
    }
    return {
      status: Status.KO,
      failReasons: validationResults.map((result) => result.failReason),
    };
  }
}

export interface ValidationResult {
  status: boolean;
  failReason?: FailReason;
}
