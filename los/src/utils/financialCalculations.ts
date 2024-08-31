import {
  FinancialStatements,
  BalanceSheet,
  IncomeStatement,
} from "../models/business";
import { LoanApplication } from "../models/loanApplication";

export function calculateDebtServiceCoverageRatio(
  financialStatements: FinancialStatements,
  loanApplication: LoanApplication
): number {
  const { incomeStatement } = financialStatements;
  const annualDebtService = calculateAnnualDebtService(loanApplication);
  const ebitda = calculateEBITDA(incomeStatement);
  const dscr = ebitda / annualDebtService;
  return Number(dscr.toFixed(2));
}

function calculateAnnualDebtService(loanApplication: LoanApplication): number {
  const monthlyPayment = calculateMonthlyPayment(
    loanApplication.requestedAmount,
    loanApplication.loanTerm,
    loanApplication.interestRate || 0
  );
  return monthlyPayment * 12;
}

function calculateMonthlyPayment(
  principal: number,
  termInMonths: number,
  annualInterestRate: number
): number {
  const monthlyRate = annualInterestRate / 12 / 100;
  if (monthlyRate === 0) return principal / termInMonths;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
    (Math.pow(1 + monthlyRate, termInMonths) - 1);
  return Number(payment.toFixed(2));
}

function calculateEBITDA(incomeStatement: IncomeStatement): number {
  // Assuming netIncome includes interest, taxes, depreciation, and amortization
  // In a real-world scenario, you'd need to add these back if they're not included
  return incomeStatement.netIncome;
}

export function calculateLeverageRatio(
  financialStatements: FinancialStatements
): number {
  const { balanceSheet } = financialStatements;
  const leverageRatio =
    balanceSheet.totalLiabilities / balanceSheet.totalAssets;
  return Number(leverageRatio.toFixed(2));
}

export function calculateCurrentRatio(
  financialStatements: FinancialStatements
): number {
  const { balanceSheet } = financialStatements;
  // Assuming currentAssets and currentLiabilities are available
  // You might need to add these to the BalanceSheet interface
  const currentRatio =
    (balanceSheet as any).currentAssets /
    (balanceSheet as any).currentLiabilities;
  return Number(currentRatio.toFixed(2));
}

export function calculateProfitMargin(
  financialStatements: FinancialStatements
): number {
  const { incomeStatement } = financialStatements;
  const profitMargin =
    (incomeStatement.netIncome / incomeStatement.revenue) * 100;
  return Number(profitMargin.toFixed(2));
}

export function calculateReturnOnAssets(
  financialStatements: FinancialStatements
): number {
  const { incomeStatement, balanceSheet } = financialStatements;
  const roa = (incomeStatement.netIncome / balanceSheet.totalAssets) * 100;
  return Number(roa.toFixed(2));
}
