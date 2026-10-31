/**
 * REPOSITORY LAYER — Persistenza Dati e Astrazione Archiviazione
 * Gestisce l'accesso e l'idratazione delle entità di Dominio.
 */

window.WeddingApp = window.WeddingApp || {};
window.WeddingApp.Repositories = (function () {
  'use strict';

  const STORAGE_KEY = 'matrimonio_michele_miriana_atelier_v3';
  const SUPABASE_URL = 'https://rpccqbydibkmkpmrlxgv.supabase.co/rest/v1/wedding_vault';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwY2NxYnlkaWJrbWtwbXJseGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MDI1OTUsImV4cCI6MjEwODk3ODU5NX0.1Gz2KzPHDCUq4ub_5OY5RuUz3eRQ6G3-p33GXyxojro';
  const VAULT_ID = 'matrimonio_mm_vault_master';

  class LocalStorageExpenseRepository {
    constructor(seedData) {
      this.seedData = seedData;
      this._onCloudUpdateCallback = null;
      this._cachedData = null;
    }

    onCloudUpdate(fn) {
      this._onCloudUpdateCallback = fn;
    }

    load() {
      // 1. Se abbiamo già i dati in memoria (dopo il sync da Supabase), restituiamo quelli
      if (this._cachedData) {
        return this._cachedData;
      }

      // 2. Altrimenti leggiamo da localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const raw = JSON.parse(stored);
          this._cachedData = this._hydrate(raw);
          return this._cachedData;
        }
      } catch (err) {
        console.warn('Repository: memoria locale non disponibile.', err);
      }

      // 3. Fallback estremo solo se è la prima volta assoluta in assoluto
      const initial = this._hydrate(this.seedData);
      this._cachedData = initial;
      return initial;
    }

    // Carica la versione fresca da Supabase Cloud
    async syncFromCloud() {
      try {
        const cacheBuster = Date.now();
        const res = await fetch(`${SUPABASE_URL}?id=eq.${VAULT_ID}&select=*&_t=${cacheBuster}`, {
          cache: 'no-store',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY
          }
        });
        if (res.ok) {
          const records = await res.json();
          if (records && records.length > 0 && records[0].data) {
            const cloudPlain = records[0].data;
            this._cachedData = this._hydrate(cloudPlain);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudPlain));
            return { success: true, data: this._cachedData, updatedAt: records[0].updated_at };
          }
        }
      } catch (err) {
        console.warn('Sync Cloud non raggiungibile (offline):', err);
      }
      return { success: false };
    }

    // Salva in Locale e poi invia istantaneamente a Supabase Cloud
    persist(dataset) {
      try {
        this._cachedData = dataset;
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
            payer: e.payer || 'both',
            isEstimate: Boolean(e.isEstimate),
            staffCount: Math.max(0, parseInt(e.staffCount, 10) || 0)
          })),
          guests: (dataset.guests || []).map(g => ({
            id: g.id,
            name: g.name,
            party: g.party || 'both',
            count: g.count || (Math.max(1, (g.adultsCount || 0) + (g.childrenCount || 0))),
            adultsCount: g.adultsCount !== undefined ? g.adultsCount : (g.guestType === 'child' ? 0 : (g.count || 1)),
            childrenCount: g.childrenCount !== undefined ? g.childrenCount : (g.guestType === 'child' ? (g.count || 1) : 0),
            gift: g.gift || 0,
            isGiftReceived: Boolean(g.isGiftReceived),
            isGiftCustom: Boolean(g.isGiftCustom),
            notes: g.notes || '',
            guestType: g.guestType || ((g.notes || '').toLowerCase().includes('bambin') ? 'child' : 'adult')
          }))
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plainData));

        // Spedizione asincrona a Supabase Cloud (senza bloccare la UI)
        this._pushToCloud(plainData);

        return true;
      } catch (err) {
        console.error('Repository: errore nel salvataggio.', err);
        return false;
      }
    }

    async _pushToCloud(plainData) {
      try {
        const payload = {
          id: VAULT_ID,
          data: plainData,
          updated_at: new Date().toISOString()
        };
        await fetch(SUPABASE_URL, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Salvataggio cloud differito (offline):', err);
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
      
      // Auto-migrazione: se gli ospiti salvati non hanno ancora valorizzati esplicitamente adultsCount/childrenCount/guestType
      // li valorizziamo e li arricchiamo deducendoli dalle note/menù
      const guests = rawGuests.map(g => {
        if (g.adultsCount === undefined || g.childrenCount === undefined || !g.guestType) {
          const isChild = (g.notes || '').toLowerCase().includes('bambin') || g.guestType === 'child';
          const adults = g.adultsCount !== undefined ? Number(g.adultsCount) : (isChild ? 0 : (Number(g.count) || 1));
          const children = g.childrenCount !== undefined ? Number(g.childrenCount) : (isChild ? (Number(g.count) || 1) : 0);
          return new Guest({
            ...g,
            adultsCount: adults,
            childrenCount: children,
            guestType: (children > 0 && adults > 0) ? 'family' : (children > 0 && adults === 0 ? 'child' : 'adult'),
            gift: (isChild && (!g.isGiftCustom || g.gift === 100)) ? 0 : g.gift
          });
        }
        return new Guest(g);
      });

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

      // Calcola il numero effettivo di persone/coperti a tavola sommando adulti e bambini
      const totalPeopleCount = guests.reduce((sum, g) => {
        const adults = g.adultsCount !== undefined ? Number(g.adultsCount) : (g.guestType === 'child' ? 0 : (Number(g.count) || 1));
        const children = g.childrenCount !== undefined ? Number(g.childrenCount) : (g.guestType === 'child' ? (Number(g.count) || 1) : 0);
        return sum + adults + children;
      }, 0);
      const effectiveGuestCount = totalPeopleCount > 0 ? totalPeopleCount : (raw.details?.estimatedGuests || this.seedData?.details?.estimatedGuests || 112);
      const details = {
        ...(this.seedData?.details || {}),
        ...(raw.details || {}),
        estimatedGuests: effectiveGuestCount
      };

      // Aggiornamento dinamico del Catering in base ad adulti, bambini e staff (150€ + 10% IVA per adulti, 50% per bambini e staff)
      const cateringExpense = expenses.find(e => e.id === 'exp_2' || (e.categoryId === 'location_catering' && e.item.toLowerCase().includes('catering')));
      if (cateringExpense) {
        let adultCount = 0;
        let childCount = 0;
        guests.forEach(g => {
          const adults = g.adultsCount !== undefined ? Number(g.adultsCount) : (g.guestType === 'child' ? 0 : (Number(g.count) || 1));
          const children = g.childrenCount !== undefined ? Number(g.childrenCount) : (g.guestType === 'child' ? (Number(g.count) || 1) : 0);
          adultCount += adults;
          childCount += children;
        });
        if (guests.length === 0) adultCount = effectiveGuestCount;
        const vendorStaffSum = expenses.reduce((sum, exp) => sum + (exp.id !== 'exp_2' ? (Number(exp.staffCount) || 0) : 0), 0);
        const staffCount = vendorStaffSum > 0 ? vendorStaffSum : Math.max(0, parseInt(details.staffMealsCount ?? 0, 10) || 0);

        const adultTotal = Math.round(150 * 1.1 * adultCount);
        const childTotal = Math.round(75 * 1.1 * childCount);
        const staffTotal = Math.round(75 * 1.1 * staffCount);
        cateringExpense.budget = adultTotal + childTotal + staffTotal;

        let labelDesc = `${adultCount} adulti`;
        if (childCount > 0) labelDesc += ` + ${childCount} bambini (50%)`;
        if (staffCount > 0) labelDesc += ` + ${staffCount} staff (50%)`;
        cateringExpense.item = `Banchetto & Catering (${labelDesc})`;
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
