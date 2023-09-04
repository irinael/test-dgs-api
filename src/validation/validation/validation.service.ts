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

  private computeValidationResults(
    movements: Movement[],
    checkPoints: Checkpoint[],
  ): ValidationResult[] {
    const validationResults: ValidationResult[] = [];

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

    const message = this.getErrorMessage(
      totalMovements,
      expectedBalanceForPeriode,
    );
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

    return duplicatedMovements;
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
