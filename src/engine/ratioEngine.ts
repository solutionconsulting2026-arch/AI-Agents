import { ExtractedField, FinancialRatio } from '../types';

export function computeFinancialRatios(fields: ExtractedField[]): FinancialRatio[] {
  const getVal = (id: string, year: 'fy2025' | 'fy2024' | 'fy2023'): number => {
    const f = fields.find(item => item.id === id);
    return f ? f[year] : 0;
  };

  const calculateForYear = (year: 'fy2025' | 'fy2024' | 'fy2023') => {
    const rev = getVal('f-rev', year);
    const ebitda = getVal('f-ebitda', year);
    const dep = getVal('f-dep', year);
    const fin = getVal('f-fin', year);
    const pat = getVal('f-pat', year);
    const nw = getVal('f-nw', year);
    const ltb = getVal('f-ltb', year);
    const stb = getVal('f-stb', year);
    const tp = getVal('f-tp', year);
    const ocl = getVal('f-ocl', year);
    const inv = getVal('f-inv', year);
    const tr = getVal('f-tr', year);
    const cash = getVal('f-cash', year);
    const bankCredits = getVal('f-bank-cred', year);

    const ca = inv + tr + cash;
    const cl = stb + tp + ocl;
    const tol = ltb + cl;
    const totalDebt = ltb + stb;

    // 1. Current Ratio
    const currentRatio = cl > 0 ? (ca / cl) : 0;

    // 2. DSCR: (PAT + Dep + Interest) / (Interest + CPLTD ~60L)
    const principalRepayment = year === 'fy2025' ? 60 : (year === 'fy2024' ? 55 : 50);
    const dscr = (fin + principalRepayment) > 0 ? (pat + dep + fin) / (fin + principalRepayment) : 0;

    // 3. TOL / TNW
    const tolTnw = nw > 0 ? (tol / nw) : 0;

    // 4. Debt / Equity
    const deRatio = nw > 0 ? (totalDebt / nw) : 0;

    // 5. Interest Coverage Ratio (ICR)
    const icr = fin > 0 ? (ebitda / fin) : 0;

    // 6. EBITDA Margin (%)
    const ebitdaMargin = rev > 0 ? (ebitda / rev) * 100 : 0;

    // 7. PAT Margin (%)
    const patMargin = rev > 0 ? (pat / rev) * 100 : 0;

    // 8. Working Capital Days = (Debtor Days + Inventory Days - Creditor Days)
    const debtorDays = rev > 0 ? (tr / rev) * 365 : 0;
    const invDays = rev > 0 ? (inv / rev) * 365 : 0;
    const credDays = rev > 0 ? (tp / rev) * 365 : 0;
    const wcCycleDays = debtorDays + invDays - credDays;

    // 9. Bank Credits / Turnover (%)
    const bankTurnoverPct = rev > 0 ? (bankCredits / rev) * 100 : 0;

    return {
      currentRatio,
      dscr,
      tolTnw,
      deRatio,
      icr,
      ebitdaMargin,
      patMargin,
      wcCycleDays,
      bankTurnoverPct
    };
  };

  const y25 = calculateForYear('fy2025');
  const y24 = calculateForYear('fy2024');
  const y23 = calculateForYear('fy2023');

  return [
    {
      id: 'ratio-current-ratio',
      name: 'Current Ratio',
      category: 'Liquidity',
      formula: 'Total Current Assets / Total Current Liabilities',
      benchmark: '≥ 1.33x',
      fy2023: y23.currentRatio.toFixed(2),
      fy2024: y24.currentRatio.toFixed(2),
      fy2025: y25.currentRatio.toFixed(2),
      unit: 'x',
      trend: y25.currentRatio >= y24.currentRatio ? 'improving' : 'stable',
      isHealthy: y25.currentRatio >= 1.15,
      impactedByFieldIds: ['f-inv', 'f-tr', 'f-cash', 'f-stb', 'f-tp', 'f-ocl']
    },
    {
      id: 'ratio-dscr',
      name: 'Debt Service Coverage Ratio (DSCR)',
      category: 'Coverage & Service',
      formula: '(PAT + Dep + Finance Costs) / (Finance Costs + Principal Repayment)',
      benchmark: '≥ 1.50x',
      fy2023: y23.dscr.toFixed(2),
      fy2024: y24.dscr.toFixed(2),
      fy2025: y25.dscr.toFixed(2),
      unit: 'x',
      trend: y25.dscr >= y24.dscr ? 'improving' : 'deteriorating',
      isHealthy: y25.dscr >= 1.5,
      impactedByFieldIds: ['f-pat', 'f-dep', 'f-fin', 'f-ltb']
    },
    {
      id: 'ratio-tol-tnw',
      name: 'TOL / TNW (Total Outside Liabilities / Net Worth)',
      category: 'Solvency & Leverage',
      formula: '(Long Term Borrowings + Current Liabilities) / Tangible Net Worth',
      benchmark: '≤ 2.50x',
      fy2023: y23.tolTnw.toFixed(2),
      fy2024: y24.tolTnw.toFixed(2),
      fy2025: y25.tolTnw.toFixed(2),
      unit: 'x',
      trend: y25.tolTnw <= y24.tolTnw ? 'improving' : 'deteriorating',
      isHealthy: y25.tolTnw <= 2.0,
      impactedByFieldIds: ['f-ltb', 'f-stb', 'f-tp', 'f-ocl', 'f-nw']
    },
    {
      id: 'ratio-de',
      name: 'Debt / Equity Ratio',
      category: 'Solvency & Leverage',
      formula: '(Long Term Borrowings + Short Term Borrowings) / Tangible Net Worth',
      benchmark: '≤ 1.50x',
      fy2023: y23.deRatio.toFixed(2),
      fy2024: y24.deRatio.toFixed(2),
      fy2025: y25.deRatio.toFixed(2),
      unit: 'x',
      trend: y25.deRatio <= y24.deRatio ? 'improving' : 'stable',
      isHealthy: y25.deRatio <= 1.0,
      impactedByFieldIds: ['f-ltb', 'f-stb', 'f-nw']
    },
    {
      id: 'ratio-icr',
      name: 'Interest Coverage Ratio (ICR)',
      category: 'Coverage & Service',
      formula: 'EBITDA / Finance Costs',
      benchmark: '≥ 2.50x',
      fy2023: y23.icr.toFixed(2),
      fy2024: y24.icr.toFixed(2),
      fy2025: y25.icr.toFixed(2),
      unit: 'x',
      trend: y25.icr >= y24.icr ? 'improving' : 'stable',
      isHealthy: y25.icr >= 3.0,
      impactedByFieldIds: ['f-ebitda', 'f-fin']
    },
    {
      id: 'ratio-ebitda-margin',
      name: 'EBITDA Margin (%)',
      category: 'Profitability',
      formula: '(EBITDA / Revenue from Operations) * 100',
      benchmark: '≥ 12.0%',
      fy2023: `${y23.ebitdaMargin.toFixed(1)}%`,
      fy2024: `${y24.ebitdaMargin.toFixed(1)}%`,
      fy2025: `${y25.ebitdaMargin.toFixed(1)}%`,
      unit: '%',
      trend: y25.ebitdaMargin >= y24.ebitdaMargin ? 'improving' : 'deteriorating',
      isHealthy: y25.ebitdaMargin >= 14.0,
      impactedByFieldIds: ['f-ebitda', 'f-rev']
    },
    {
      id: 'ratio-pat-margin',
      name: 'PAT Margin (%)',
      category: 'Profitability',
      formula: '(PAT / Revenue from Operations) * 100',
      benchmark: '≥ 5.0%',
      fy2023: `${y23.patMargin.toFixed(1)}%`,
      fy2024: `${y24.patMargin.toFixed(1)}%`,
      fy2025: `${y25.patMargin.toFixed(1)}%`,
      unit: '%',
      trend: y25.patMargin >= y24.patMargin ? 'improving' : 'stable',
      isHealthy: y25.patMargin >= 7.0,
      impactedByFieldIds: ['f-pat', 'f-rev']
    },
    {
      id: 'ratio-wc-cycle',
      name: 'Working Capital Cycle (Days)',
      category: 'Working Capital',
      formula: 'Debtor Days + Inventory Days - Creditor Days',
      benchmark: '60 – 90 Days',
      fy2023: `${Math.round(y23.wcCycleDays)} Days`,
      fy2024: `${Math.round(y24.wcCycleDays)} Days`,
      fy2025: `${Math.round(y25.wcCycleDays)} Days`,
      unit: 'Days',
      trend: y25.wcCycleDays <= y24.wcCycleDays ? 'improving' : 'stable',
      isHealthy: y25.wcCycleDays <= 95,
      impactedByFieldIds: ['f-tr', 'f-inv', 'f-tp', 'f-rev']
    },
    {
      id: 'ratio-bank-turnover-ratio',
      name: 'Bank Credits / Turnover Ratio',
      category: 'Banking Health',
      formula: '(Total Inward Bank Credits / P&L Turnover) * 100',
      benchmark: '≥ 90.0%',
      fy2023: `${y23.bankTurnoverPct.toFixed(1)}%`,
      fy2024: `${y24.bankTurnoverPct.toFixed(1)}%`,
      fy2025: `${y25.bankTurnoverPct.toFixed(1)}%`,
      unit: '%',
      trend: y25.bankTurnoverPct >= 90 ? 'improving' : 'deteriorating',
      isHealthy: y25.bankTurnoverPct >= 90.0,
      impactedByFieldIds: ['f-bank-cred', 'f-rev']
    }
  ];
}
