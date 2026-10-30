/**
 * DOMAIN LAYER — Entità e Regole di Business
 * Indipendente da UI, Framework, LocalStorage e DOM.
 */

window.WeddingApp = window.WeddingApp || {};
window.WeddingApp.Domain = (function () {
  'use strict';

  class Expense {
    constructor({
      id,
      categoryId,
      item,
      supplier = '',
      budget = 0,
      paidMichele = 0,
      paidMiriana = 0,
      status = 'pianificato',
      notes = '',
      dueDate = ''
    }) {
      this.id = id || ('exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5));
      this.categoryId = categoryId;
      this.item = (item || '').trim();
      this.supplier = (supplier || '').trim();
      this.budget = Math.max(0, Number(budget) || 0);
      this.paidMichele = Math.max(0, Number(paidMichele) || 0);
      this.paidMiriana = Math.max(0, Number(paidMiriana) || 0);
      this.status = status || 'pianificato';
      this.notes = (notes || '').trim();
      this.dueDate = dueDate || '';
    }

    totalPaid() {
      return this.paidMichele + this.paidMiriana;
    }

    remaining() {
      return Math.max(0, this.budget - this.totalPaid());
    }

    isFullyPaid() {
      return (this.budget > 0 && this.totalPaid() >= this.budget) || this.status === 'saldato';
    }

    hasAdvance() {
      return this.totalPaid() > 0 && !this.isFullyPaid();
    }

    resolveStatus() {
      if (this.isFullyPaid()) return 'saldato';
      if (this.hasAdvance()) return 'acconto';
      return 'pianificato';
    }

    validate() {
      const errors = [];
      if (!this.item) errors.push('Il nome del servizio o voce è obbligatorio.');
      if (!this.categoryId) errors.push('La categoria è obbligatoria.');
      if (isNaN(this.budget) || this.budget < 0) errors.push('Il budget previsto deve essere un valore positivo.');
      if (isNaN(this.paidMichele) || this.paidMichele < 0) errors.push('La quota di Michele deve essere un valore positivo.');
      if (isNaN(this.paidMiriana) || this.paidMiriana < 0) errors.push('La quota di Miriana deve essere un valore positivo.');
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  }

  class Category {
    constructor({ id, name, color, icon, description }) {
      this.id = id;
      this.name = name;
      this.color = color;
      this.icon = icon;
      this.description = description || '';
    }
  }

  class WeddingFinances {
    static calculate({ expenses = [], savingsPlan = {}, categories = [], details = {}, targetDate = null, referenceDate = null } = {}) {
      const safeExpenses = expenses || [];
      const plan = savingsPlan || {};
      const safeCategories = categories || [];
      const safeDetails = details || {};

      let totalBudget = 0;
      let totalPaidMichele = 0;
      let totalPaidMiriana = 0;

      const categoryAggregates = {};
      safeCategories.forEach(cat => {
        categoryAggregates[cat.id] = {
          category: cat,
          budget: 0,
          paidMichele: 0,
          paidMiriana: 0,
          totalPaid: 0,
          remaining: 0,
          count: 0
        };
      });

      safeExpenses.forEach(exp => {
        const b = exp.budget || 0;
        const pm = exp.paidMichele || 0;
        const pmi = exp.paidMiriana || 0;
        const tp = typeof exp.totalPaid === 'function' ? exp.totalPaid() : (pm + pmi);

        totalBudget += b;
        totalPaidMichele += pm;
        totalPaidMiriana += pmi;

        if (categoryAggregates[exp.categoryId]) {
          const c = categoryAggregates[exp.categoryId];
          c.budget += b;
          c.paidMichele += pm;
          c.paidMiriana += pmi;
          c.totalPaid += tp;
          c.remaining += Math.max(0, b - tp);
          c.count += 1;
        }
      });

      const totalPaid = totalPaidMichele + totalPaidMiriana;
      const totalRemaining = Math.max(0, totalBudget - totalPaid);
      const progressPercentage = totalBudget > 0 ? (totalPaid / totalBudget) * 100 : 0;

      // Percentuali su Budget Complessivo (come da formule C77 e D77)
      const micheleBudgetPct = totalBudget > 0 ? (totalPaidMichele / totalBudget) * 100 : 0;
      const mirianaBudgetPct = totalBudget > 0 ? (totalPaidMiriana / totalBudget) * 100 : 0;

      // Bilancio di Coppia
      const diff = totalPaidMichele - totalPaidMiriana;
      const michelePct = totalPaid > 0 ? (totalPaidMichele / totalPaid) * 100 : 50;
      const mirianaPct = totalPaid > 0 ? (totalPaidMiriana / totalPaid) * 100 : 50;

      // Numero Ospiti e Formula Doni (formula Excel B15: Ospiti * 100€)
      const estimatedGuests = Number(safeDetails.estimatedGuests ?? 100);
      const giftsEstimated = Number((plan.weddingGifts?.isManual ? plan.weddingGifts?.estimated : null) ?? (estimatedGuests * 100));

      // Dono Famiglia Amedeo & Anna e Regali
      const famPledged = Number(plan.familyContribution?.totalPledged ?? 10000);
      const famUsed = Number(plan.familyContribution?.alreadyAdvanced ?? 1500);
      const famAvailable = Math.max(0, famPledged - famUsed);
      const famTotalGiftsProjected = famPledged + giftsEstimated;
      const famFinalNetResidual = famAvailable + giftsEstimated;

      // Calcolo automatico della cronologia in tempo reale o simulata (data inizio, data odierna/simulata, data matrimonio)
      const dateService = window.WeddingApp?.Services?.DateService;
      const targetWeddingDate = safeDetails.date || targetDate || plan.targetDate || '2027-07-02';
      const timeline = dateService
        ? dateService.calculateMonthsTimeline(plan.startDate || '2025-10-10', targetWeddingDate, referenceDate || new Date())
        : { elapsedMonths: 12, remainingMonths: 9, totalMonths: 21, todayFormatted: 'Oggi', isPassed: false };

      // Dettaglio Conto Personale & Accumulo Michele (calcolato automaticamente)
      const mInitial = Number(plan.michele?.initialSavings ?? 9000);
      const mMonthly = Number(plan.michele?.monthlySavings ?? 740);
      const mCurrentMonths = Number((plan.michele?.isManualMonths && plan.michele?.currentMonths !== undefined)
        ? plan.michele.currentMonths
        : timeline.elapsedMonths);
      const mRemainingMonths = Number((plan.michele?.isManualMonths && plan.michele?.remainingMonths !== undefined)
        ? plan.michele.remainingMonths
        : timeline.remainingMonths);
      const mAccCurrent = mMonthly * mCurrentMonths;
      const mAccRemaining = mMonthly * mRemainingMonths;
      const mGrossProjected = mInitial + mAccCurrent + mAccRemaining;
      const mExpensesPaid = totalPaidMichele;
      const mCurrentNetLiquidity = mInitial + mAccCurrent - mExpensesPaid;
      const mFinalNetResidual = mGrossProjected - mExpensesPaid;

      // Dettaglio Conto Personale & Accumulo Miriana (calcolato automaticamente)
      const mirInitial = Number(plan.miriana?.initialSavings ?? 5000);
      const mirMonthly = Number(plan.miriana?.monthlySavings ?? 400);
      const mirCurrentMonths = Number((plan.miriana?.isManualMonths && plan.miriana?.currentMonths !== undefined)
        ? plan.miriana.currentMonths
        : timeline.elapsedMonths);
      const mirRemainingMonths = Number((plan.miriana?.isManualMonths && plan.miriana?.remainingMonths !== undefined)
        ? plan.miriana.remainingMonths
        : timeline.remainingMonths);
      const mirAccCurrent = mirMonthly * mirCurrentMonths;
      const mirAccRemaining = mirMonthly * mirRemainingMonths;
      const mirGrossProjected = mirInitial + mirAccCurrent + mirAccRemaining;
      const mirPersonalExpensesPaid = Math.max(0, totalPaidMiriana - famUsed);
      const mirCurrentNetLiquidity = mirInitial + mirAccCurrent - mirPersonalExpensesPaid;
      const mirPersonalResidual = mirGrossProjected - mirPersonalExpensesPaid;
      const mirFinalNetResidual = mirPersonalResidual;

      const totalFundsAvailable = mFinalNetResidual + mirPersonalResidual + famFinalNetResidual;
      const serenityMargin = totalFundsAvailable - totalBudget;

      return {
        totalBudget,
        totalPaidMichele,
        totalPaidMiriana,
        totalPaid,
        totalRemaining,
        progressPercentage,
        categoryAggregates,
        timeline,
        coupleBalance: {
          micheleAmount: totalPaidMichele,
          mirianaAmount: totalPaidMiriana,
          micheleSharePct: michelePct,
          mirianaSharePct: mirianaPct,
          difference: diff,
          compensationAdvice: WeddingFinances._buildBalanceAdvice(diff)
        },
        statements: {
          michele: {
            title: 'Michele',
            subtitle: 'CONTO PERSONALE & ACCUMULO',
            monthlySavings: mMonthly,
            initialSavings: mInitial,
            currentAccumulated: mAccCurrent,
            remainingAccumulated: mAccRemaining,
            totalAccumulated: mAccCurrent + mAccRemaining,
            currentMonths: mCurrentMonths,
            remainingMonths: mRemainingMonths,
            grossProjected: mGrossProjected,
            expensesPaid: mExpensesPaid,
            currentNetLiquidity: mCurrentNetLiquidity,
            finalNetResidual: mFinalNetResidual
          },
          miriana: {
            title: 'Miriana',
            subtitle: 'CONTO PERSONALE & ACCUMULO',
            monthlySavings: mirMonthly,
            initialSavings: mirInitial,
            currentAccumulated: mirAccCurrent,
            remainingAccumulated: mirAccRemaining,
            totalAccumulated: mirAccCurrent + mirAccRemaining,
            currentMonths: mirCurrentMonths,
            remainingMonths: mirRemainingMonths,
            grossProjected: mirGrossProjected,
            expensesPaid: mirPersonalExpensesPaid,
            currentNetLiquidity: mirCurrentNetLiquidity,
            finalNetResidual: mirFinalNetResidual,
            familyAvailable: famAvailable
          },
          family: {
            title: 'Famiglia & Doni',
            subtitle: 'CONTRIBUTI & REGALI STIMATI',
            pledged: famPledged,
            used: famUsed,
            available: famAvailable,
            giftsEstimated: giftsEstimated,
            grossProjected: famTotalGiftsProjected,
            expensesPaid: famUsed,
            currentNetLiquidity: famAvailable,
            finalNetResidual: famFinalNetResidual
          }
        },
        coverage: {
          totalFundsAvailable,
          totalBudgetRequired: totalBudget,
          serenityMargin,
          familyPledged: famPledged,
          familyUsed: famUsed,
          familyAvailable: famAvailable,
          giftsEstimated,
          micheleProjected: mFinalNetResidual,
          mirianaProjected: mirFinalNetResidual
        }
      };
    }

    static _buildBalanceAdvice(diff) {
      if (diff > 0) {
        return {
          status: 'michele_ahead',
          message: `Michele ha attualmente sostenuto una quota di anticipo superiore di circa ${Math.abs(diff).toLocaleString('it-IT')} €. Per riallineare l'armonia al 50%, è consigliabile affidare a Miriana i prossimi acconti previsti per una quota indicativa di ${Math.round(diff / 2).toLocaleString('it-IT')} €.`
        };
      } else if (diff < 0) {
        return {
          status: 'miriana_ahead',
          message: `Miriana ha attualmente sostenuto una quota di anticipo superiore di circa ${Math.abs(diff).toLocaleString('it-IT')} €. Per riallineare l'armonia al 50%, è consigliabile affidare a Michele i prossimi acconti previsti per una quota indicativa di ${Math.round(Math.abs(diff) / 2).toLocaleString('it-IT')} €.`
        };
      }
      return {
        status: 'balanced',
        message: 'Le quote anticipate tra Michele e Miriana sono in perfetto equilibrio (50% e 50%).'
      };
    }
  }

  return {
    Expense,
    Category,
    WeddingFinances
  };
})();
