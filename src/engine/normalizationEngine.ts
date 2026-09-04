import { standardCoAMappingDictionary } from '../data/mockBorrowerData';

export interface NormalizationTransformation {
  originalLabel: string;
  originalValueStr: string;
  originalUnit: string;
  conversionFactor: number;
  normalizedValue: number;
  normalizedUnit: string;
  standardField: string;
  category: string;
  ruleApplied: string;
}

export function normalizeUnitAndValue(
  value: number | string,
  fromUnit: 'Crore' | 'Lakhs' | 'Thousands' | 'Absolute',
  toUnit: 'Lakhs' = 'Lakhs'
): { normalizedValue: number; conversionFactor: number } {
  let numVal = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  if (isNaN(numVal)) numVal = 0;

  let factor = 1.0;
  if (fromUnit === 'Crore') {
    factor = 100.0;
    numVal = numVal * 100;
  } else if (fromUnit === 'Thousands') {
    factor = 0.01;
    numVal = numVal / 100;
  } else if (fromUnit === 'Absolute') {
    factor = 0.00001;
    numVal = numVal / 100000;
  }

  return {
    normalizedValue: Number(numVal.toFixed(2)),
    conversionFactor: factor
  };
}

export function getSampleTransformations(): NormalizationTransformation[] {
  return [
    {
      originalLabel: 'Sundry Creditors (Schedule 6)',
      originalValueStr: '4,05,00,000',
      originalUnit: '₹ Absolute',
      conversionFactor: 0.00001,
      normalizedValue: 405.00,
      normalizedUnit: '₹ Lakhs',
      standardField: 'Trade Payables',
      category: 'Balance Sheet - Liabilities',
      ruleApplied: 'RULE_UNIT_ABS_TO_LAKH + COA_MAP_BS_LIAB_04'
    },
    {
      originalLabel: 'Gross Sales / Turnover',
      originalValueStr: '₹ 25.00 Cr',
      originalUnit: '₹ Crore',
      conversionFactor: 100.0,
      normalizedValue: 2500.00,
      normalizedUnit: '₹ Lakhs',
      standardField: 'Revenue from Operations',
      category: 'P&L - Revenue',
      ruleApplied: 'RULE_UNIT_CR_TO_LAKH + COA_MAP_PL_REV_01'
    },
    {
      originalLabel: 'Operating Profit (PBIDT)',
      originalValueStr: '₹ 4.20 Cr',
      originalUnit: '₹ Crore',
      conversionFactor: 100.0,
      normalizedValue: 420.00,
      normalizedUnit: '₹ Lakhs',
      standardField: 'Operating Profit (EBITDA)',
      category: 'P&L - Profitability',
      ruleApplied: 'RULE_UNIT_CR_TO_LAKH + COA_MAP_PL_OP_02'
    },
    {
      originalLabel: 'Balances with Scheduled Banks',
      originalValueStr: '90,00,000',
      originalUnit: '₹ Absolute',
      conversionFactor: 0.00001,
      normalizedValue: 90.00,
      normalizedUnit: '₹ Lakhs',
      standardField: 'Cash & Cash Equivalents',
      category: 'Balance Sheet - Assets',
      ruleApplied: 'RULE_UNIT_ABS_TO_LAKH + COA_MAP_BS_ASST_05'
    },
    {
      originalLabel: 'Paid Up Equity Share Capital',
      originalValueStr: '₹ 1.20 Cr',
      originalUnit: '₹ Crore',
      conversionFactor: 100.0,
      normalizedValue: 120.00,
      normalizedUnit: '₹ Lakhs',
      standardField: 'Share Capital',
      category: 'Balance Sheet - Liabilities',
      ruleApplied: 'RULE_UNIT_CR_TO_LAKH + COA_MAP_BS_LIAB_01'
    }
  ];
}
