/**
 * USE CASES LAYER — Casi d'Uso dell'Applicazione
 * Coordina entità di dominio, repository e servizi senza toccare il DOM.
 */

window.WeddingApp = window.WeddingApp || {};
window.WeddingApp.UseCases = (function () {
  'use strict';

  class GetWeddingSummaryUseCase {
    constructor(repository) {
      this.repository = repository;
    }

    execute({ referenceDate = null } = {}) {
      const data = this.repository.load();
      const finances = window.WeddingApp.Domain.WeddingFinances.calculate({
        expenses: data.expenses,
        savingsPlan: data.savingsPlan,
        categories: data.categories,
        details: data.details,
        referenceDate
      });

      return {
        couple: data.couple,
        details: data.details,
        savingsPlan: data.savingsPlan,
        categories: data.categories,
        finances
      };
    }
  }

  class FilterExpensesUseCase {
    static execute(expenses = [], categories = [], { query = '', categoryId = 'all', payer = 'all', status = 'all' } = {}) {
      const q = (query || '').toLowerCase().trim();
      const catMap = {};
      categories.forEach(c => { catMap[c.id] = c.name.toLowerCase(); });

      return expenses.filter(exp => {
        if (q) {
          const matchItem = exp.item.toLowerCase().includes(q);
          const matchNotes = exp.notes.toLowerCase().includes(q);
          const matchSupplier = exp.supplier.toLowerCase().includes(q);
          const matchCat = catMap[exp.categoryId] && catMap[exp.categoryId].includes(q);
          if (!matchItem && !matchNotes && !matchSupplier && !matchCat) return false;
        }

        if (categoryId !== 'all' && exp.categoryId !== categoryId) return false;

        if (payer === 'michele' && exp.paidMichele <= 0) return false;
        if (payer === 'miriana' && exp.paidMiriana <= 0) return false;
        if (payer === 'both' && (exp.paidMichele <= 0 || exp.paidMiriana <= 0)) return false;
        if (payer === 'unpaid' && (exp.paidMichele > 0 || exp.paidMiriana > 0)) return false;

        if (status !== 'all') {
          const currentStatus = exp.resolveStatus();
          if (currentStatus !== status) return false;
        }

        return true;
      });
    }
  }

  class SaveExpenseUseCase {
    constructor(repository) {
      this.repository = repository;
    }

    execute(expenseInput) {
      const { Expense } = window.WeddingApp.Domain;
      const data = this.repository.load();

      const expense = new Expense(expenseInput);
      const validation = expense.validate();
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      const existingIndex = data.expenses.findIndex(e => e.id === expense.id);
      if (existingIndex !== -1) {
        data.expenses[existingIndex] = expense;
      } else {
        data.expenses.push(expense);
      }

      this.repository.persist(data);
      return { success: true, expense };
    }
  }

  class DeleteExpenseUseCase {
    constructor(repository) {
      this.repository = repository;
    }

    execute(expenseId) {
      const data = this.repository.load();
      const initialLength = data.expenses.length;
      data.expenses = data.expenses.filter(e => e.id !== expenseId);

      if (data.expenses.length === initialLength) {
        return { success: false, message: 'Voce non trovata.' };
      }

      this.repository.persist(data);
      return { success: true };
    }
  }

  class ExportLedgerCsvUseCase {
    constructor(repository) {
      this.repository = repository;
    }

    execute() {
      const data = this.repository.load();
      const csv = window.WeddingApp.Services.CsvExporterService.generateCsv(data.expenses, data.categories);
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `Riepilogo_Matrimonio_Michele_Miriana_${dateStr}.csv`;
      window.WeddingApp.Services.CsvExporterService.download(csv, filename);
      return { success: true };
    }
  }

  class BackupVaultUseCase {
    constructor(repository) {
      this.repository = repository;
    }

    exportBackup() {
      const data = this.repository.load();
      const serialized = window.WeddingApp.Services.BackupService.serialize(data);
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `Archivio_Matrimonio_Michele_Miriana_${dateStr}.json`;
      window.WeddingApp.Services.BackupService.downloadJson(serialized, filename);
      return { success: true };
    }

    importBackup(jsonString) {
      const result = window.WeddingApp.Services.BackupService.deserialize(jsonString);
      if (!result.success) {
        return { success: false, message: result.error };
      }

      this.repository.persist(result.data);
      return { success: true };
    }

    reset() {
      this.repository.reset();
      return { success: true };
    }
  }

  class UpdateSavingsPlanUseCase {
    constructor(repository) {
      this.repository = repository;
    }

    execute(updatedPlan) {
      if (!updatedPlan) {
        throw new Error('Parametri di copertura non validi.');
      }
      return this.repository.updateSavingsPlan(updatedPlan);
    }
  }

  return {
    GetWeddingSummaryUseCase,
    FilterExpensesUseCase,
    SaveExpenseUseCase,
    DeleteExpenseUseCase,
    ExportLedgerCsvUseCase,
    BackupVaultUseCase,
    UpdateSavingsPlanUseCase
  };
})();
