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
      dueDate = '',
      splitType = 'equal', // 'equal' (50/50), 'michele' (100% Michele), 'miriana' (100% Miriana), 'guests' (proporzionale invitati)
      payer = 'both' // indicativo di chi si occupa del pagamento
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
      this.splitType = splitType || 'equal';
      this.payer = payer || 'both';
    }

    calculateOwed(micheleGuestRatio = 0.5) {
      const b = this.budget;
      if (this.splitType === 'michele') {
        return { micheleOwed: b, mirianaOwed: 0 };
      }
      if (this.splitType === 'miriana') {
        return { micheleOwed: 0, mirianaOwed: b };
      }
      if (this.splitType === 'guests') {
        const m = Math.round(b * micheleGuestRatio * 100) / 100;
        return { micheleOwed: m, mirianaOwed: Math.round((b - m) * 100) / 100 };
      }
      // 'equal' default 50/50
      const half = Math.round((b / 2) * 100) / 100;
      return { micheleOwed: half, mirianaOwed: Math.round((b - half) * 100) / 100 };
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

  class Guest {
    constructor({
      id,
      name,
      party = 'both', // 'michele', 'miriana', 'both'
      count = 1,
      gift = 0,
      isGiftReceived = false,
      isGiftCustom = false,
      notes = ''
    }) {
      this.id = id || ('gst_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5));
      this.name = (name || '').trim();
      this.party = party || 'both';
      this.count = Math.max(1, parseInt(count, 10) || 1);
      this.gift = Math.max(0, Number(gift) || 0);
      this.isGiftReceived = Boolean(isGiftReceived);
      this.isGiftCustom = Boolean(isGiftCustom);
      this.notes = (notes || '').trim();
    }

    validate() {
      const errors = [];
      if (!this.name) errors.push('Il nominativo dell\'ospite è obbligatorio.');
      if (this.count < 1) errors.push('Il numero di persone deve essere almeno 1.');
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  }

  class WeddingFinances {
    static calculate({ expenses = [], guests = [], savingsPlan = {}, categories = [], details = {}, targetDate = null, referenceDate = null } = {}) {
      const safeExpenses = expenses || [];
      const safeGuests = guests || [];
      const plan = savingsPlan || {};
      const safeCategories = categories || [];
      const safeDetails = details || {};

      // Conteggio Ospiti Nominativi
      let guestsCountMichele = 0;
      let guestsCountMiriana = 0;
      let guestsCountBoth = 0;
      let giftsTotalReceived = 0;
      let giftsTotalProjected = 0;

      safeGuests.forEach(g => {
        const c = Number(g.count) || 1;
        const giftVal = Number(g.gift) || (c * 100);
        if (g.party === 'michele') guestsCountMichele += c;
        else if (g.party === 'miriana') guestsCountMiriana += c;
        else guestsCountBoth += c;

        giftsTotalProjected += giftVal;
        if (g.isGiftReceived) {
          giftsTotalReceived += giftVal;
        }
      });

      const totalRosteredGuests = guestsCountMichele + guestsCountMiriana + guestsCountBoth;
      const effectiveTotalGuests = totalRosteredGuests > 0 ? totalRosteredGuests : Number(safeDetails.estimatedGuests ?? 100);

      // Rapporto Ospiti per ripartizione spese proporzionali
      const micheleEffectiveGuests = guestsCountMichele + (guestsCountBoth / 2);
      const micheleGuestRatio = effectiveTotalGuests > 0 ? (micheleEffectiveGuests / effectiveTotalGuests) : 0.5;

      let totalBudget = 0;
      let totalPaidMichele = 0;
      let totalPaidMiriana = 0;
      let totalOwedMichele = 0;
      let totalOwedMiriana = 0;

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

        if (typeof exp.calculateOwed === 'function') {
          const owed = exp.calculateOwed(micheleGuestRatio);
          totalOwedMichele += owed.micheleOwed;
          totalOwedMiriana += owed.mirianaOwed;
        } else {
          const half = Math.round((b / 2) * 100) / 100;
          totalOwedMichele += half;
          totalOwedMiriana += (b - half);
        }

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

      // Bilancio di Coppia Reale (Spese a proprio carico vs Anticipi erogati)
      const diff = totalPaidMichele - totalPaidMiriana;
      const settlementDiff = totalPaidMichele - totalOwedMichele; // Se positivo, Michele è in credito conguaglio
      const michelePct = totalPaid > 0 ? (totalPaidMichele / totalPaid) * 100 : 50;
      const mirianaPct = totalPaid > 0 ? (totalPaidMiriana / totalPaid) * 100 : 50;

      // Numero Ospiti e Formula Doni (formula Excel B15: Ospiti * 100€)
      const estimatedGuests = effectiveTotalGuests;
      const giftsEstimated = safeGuests.length > 0
        ? giftsTotalProjected
        : Number((plan.weddingGifts?.isManual ? plan.weddingGifts?.estimated : null) ?? (estimatedGuests * 100));

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
          micheleOwed: totalOwedMichele,
          mirianaOwed: totalOwedMiriana,
          settlementDiff,
          micheleSharePct: michelePct,
          mirianaSharePct: mirianaPct,
          difference: diff,
          compensationAdvice: WeddingFinances._buildBalanceAdvice(settlementDiff, totalOwedMichele, totalOwedMiriana, totalPaidMichele, totalPaidMiriana),
          guestStats: {
            totalGuests: effectiveTotalGuests,
            rosteredGuests: totalRosteredGuests,
            micheleGuests: guestsCountMichele,
            mirianaGuests: guestsCountMiriana,
            bothGuests: guestsCountBoth,
            micheleRatio: micheleGuestRatio,
            giftsTotalProjected,
            giftsTotalReceived
          }
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

    static _buildBalanceAdvice(settlementDiff, owedM = 0, owedMir = 0, paidM = 0, paidMir = 0) {
      const absSettlement = Math.abs(Math.round(settlementDiff));
      if (settlementDiff > 1) {
        return {
          status: 'michele_credit',
          diff: settlementDiff,
          message: `In base alle responsabilità concordate (spese personali, 50/50 e proporzione invitati), Michele ha anticipato ${absSettlement.toLocaleString('it-IT')} € in più rispetto alla sua quota ideale. A conguaglio o nei prossimi pagamenti, Miriana dovrebbe coprire circa ${absSettlement.toLocaleString('it-IT')} €.`
        };
      } else if (settlementDiff < -1) {
        return {
          status: 'miriana_credit',
          diff: settlementDiff,
          message: `In base alle responsabilità concordate (spese personali, 50/50 e proporzione invitati), Miriana ha anticipato ${absSettlement.toLocaleString('it-IT')} € in più rispetto alla sua quota ideale. A conguaglio o nei prossimi pagamenti, Michele dovrebbe coprire circa ${absSettlement.toLocaleString('it-IT')} €.`
        };
      }
      return {
        status: 'balanced',
        diff: 0,
        message: 'Le spese e gli anticipi tra Michele e Miriana sono in perfetto equilibrio rispetto ai rispettivi accordi.'
      };
    }
  }

  return {
    Expense,
    Category,
    Guest,
    WeddingFinances
  };
})();
