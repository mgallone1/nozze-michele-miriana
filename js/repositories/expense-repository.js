/**
 * REPOSITORY LAYER — Persistenza Dati e Astrazione Archiviazione
 * Gestisce l'accesso e l'idratazione delle entità di Dominio.
 */

window.WeddingApp = window.WeddingApp || {};
window.WeddingApp.Repositories = (function () {
  'use strict';

  const STORAGE_KEY = 'matrimonio_michele_miriana_atelier_v3';

  class LocalStorageExpenseRepository {
    constructor(seedData) {
      this.seedData = seedData;
    }

    load() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const raw = JSON.parse(stored);
          return this._hydrate(raw);
        }
      } catch (err) {
        console.warn('Repository: impossibile leggere da memoria locale, caricamento dati base.', err);
      }

      const initial = this._hydrate(this.seedData);
      this.persist(initial);
      return initial;
    }

    persist(dataset) {
      try {
        const plainData = {
          couple: dataset.couple,
          details: dataset.details,
          savingsPlan: dataset.savingsPlan,
          categories: dataset.categories.map(c => ({
            id: c.id,
            name: c.name,
            color: c.color,
            icon: c.icon,
            description: c.description
          })),
          expenses: (dataset.expenses || []).map(e => ({
            id: e.id,
            categoryId: e.categoryId,
            item: e.item,
            supplier: e.supplier,
            budget: e.budget,
            paidMichele: e.paidMichele,
            paidMiriana: e.paidMiriana,
            status: e.status,
            notes: e.notes,
            dueDate: e.dueDate,
            splitType: e.splitType || 'equal',
            payer: e.payer || 'both'
          })),
          guests: (dataset.guests || []).map(g => ({
            id: g.id,
            name: g.name,
            party: g.party || 'both',
            count: g.count || 1,
            gift: g.gift || 0,
            isGiftReceived: Boolean(g.isGiftReceived),
            isGiftCustom: Boolean(g.isGiftCustom),
            notes: g.notes || ''
          }))
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plainData));
        return true;
      } catch (err) {
        console.error('Repository: errore nel salvataggio.', err);
        return false;
      }
    }

    updateSavingsPlan(updatedSavingsPlan) {
      const dataset = this.load();
      if (updatedSavingsPlan && updatedSavingsPlan.estimatedGuests !== undefined) {
        dataset.details = dataset.details || {};
        dataset.details.estimatedGuests = Number(updatedSavingsPlan.estimatedGuests) || 100;
      }
      dataset.savingsPlan = {
        ...(dataset.savingsPlan || {}),
        ...(updatedSavingsPlan || {}),
        michele: {
          ...(dataset.savingsPlan?.michele || {}),
          ...(updatedSavingsPlan?.michele || {})
        },
        miriana: {
          ...(dataset.savingsPlan?.miriana || {}),
          ...(updatedSavingsPlan?.miriana || {})
        },
        familyContribution: {
          ...(dataset.savingsPlan?.familyContribution || {}),
          ...(updatedSavingsPlan?.familyContribution || {})
        },
        weddingGifts: {
          ...(dataset.savingsPlan?.weddingGifts || {}),
          ...(updatedSavingsPlan?.weddingGifts || {})
        }
      };
      this.persist(dataset);
      return dataset.savingsPlan;
    }

    reset() {
      const fresh = this._hydrate(this.seedData);
      this.persist(fresh);
      return fresh;
    }

    _hydrate(raw) {
      const { Expense, Category, Guest } = window.WeddingApp.Domain;

      const categories = (raw.categories || []).map(c => new Category(c));
      const expenses = (raw.expenses || []).map(e => new Expense(e));
      
      // Se nel localStorage non ci sono ancora ospiti oppure c'erano quelli demo precedenti, sincronizziamo con seedData
      const seedGuests = (this.seedData?.guests || []);
      const isDemo = raw.guests && raw.guests.length > 0 && raw.guests.some(g => String(g.id).includes('demo'));
      const rawGuests = (!raw.guests || raw.guests.length === 0 || isDemo) ? seedGuests : raw.guests;
      const guests = rawGuests.map(g => new Guest(g));

      const rawSavings = raw.savingsPlan || {};
      const seedSavings = this.seedData?.savingsPlan || {};
      const savingsPlan = {
        ...seedSavings,
        ...rawSavings,
        michele: { ...(seedSavings.michele || {}), ...(rawSavings.michele || {}) },
        miriana: { ...(seedSavings.miriana || {}), ...(rawSavings.miriana || {}) },
        familyContribution: { ...(seedSavings.familyContribution || {}), ...(rawSavings.familyContribution || {}) },
        weddingGifts: { ...(seedSavings.weddingGifts || {}), ...(rawSavings.weddingGifts || {}) }
      };

      // Calcola il numero effettivo degli ospiti se ci sono ospiti registrati
      const effectiveGuestCount = guests.length > 0 ? guests.length : (raw.details?.estimatedGuests || this.seedData?.details?.estimatedGuests || 105);
      const details = {
        ...(this.seedData?.details || {}),
        ...(raw.details || {}),
        estimatedGuests: effectiveGuestCount
      };

      // Aggiornamento dinamico automatico del Catering in base al numero esatto di invitati (150€ + 10% IVA = 165€ a persona)
      const cateringExpense = expenses.find(e => e.id === 'exp_2' || (e.categoryId === 'location_catering' && e.item.toLowerCase().includes('catering')));
      if (cateringExpense) {
        cateringExpense.item = `Banchetto & Catering (150€ + IVA 10% × ${effectiveGuestCount} ospiti)`;
        cateringExpense.budget = Math.round(150 * 1.1 * effectiveGuestCount);
      }

      return {
        couple: raw.couple || {},
        details,
        savingsPlan,
        categories,
        expenses,
        guests
      };
    }
  }

  return {
    LocalStorageExpenseRepository
  };
})();
