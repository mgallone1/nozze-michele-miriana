/**
 * SERVICES LAYER — Servizi Puri di Formattazione, Calcolo Date ed Export
 * Funzioni pure senza manipolazioni del DOM.
 */

window.WeddingApp = window.WeddingApp || {};
window.WeddingApp.Services = (function () {
  'use strict';

  class CurrencyFormatter {
    static format(amount, options = { includeSymbol: true }) {
      const num = Math.round(Number(amount) || 0);
      const formatted = new Intl.NumberFormat('it-IT', {
        style: options.includeSymbol ? 'currency' : 'decimal',
        currency: 'EUR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(num);

      return formatted;
    }
  }

  class CountdownService {
    static calculate(targetDateString, targetTimeString = '17:00', referenceDate = null) {
      const target = new Date(`${targetDateString}T${targetTimeString}:00`);
      const now = (referenceDate instanceof Date && !isNaN(referenceDate)) ? referenceDate : new Date();
      const diff = target - now;

      if (diff <= 0) {
        return { isPassed: true, days: 0, hours: 0, minutes: 0, referenceDate: now };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      return {
        isPassed: false,
        days,
        hours,
        minutes,
        referenceDate: now
      };
    }
  }

  class CsvExporterService {
    static generateCsv(expenses = [], categories = []) {
      const catMap = {};
      categories.forEach(c => { catMap[c.id] = c.name; });

      let csv = '\uFEFF'; // UTF-8 BOM
      csv += 'Area;Servizio;Referente;Investimento (€);Quota Michele (€);Quota Miriana (€);Anticipato Totale (€);Rimanenza (€);Stato;Note\n';

      expenses.forEach(exp => {
        const cat = catMap[exp.categoryId] || '';
        const b = exp.budget.toFixed(0);
        const pm = exp.paidMichele.toFixed(0);
        const pmi = exp.paidMiriana.toFixed(0);
        const tot = exp.totalPaid().toFixed(0);
        const diff = exp.remaining().toFixed(0);
        const safeNotes = (exp.notes || '').replace(/;/g, ',').replace(/\n/g, ' ').replace(/"/g, '""');
        const safeItem = (exp.item || '').replace(/;/g, ',').replace(/"/g, '""');
        const safeSupplier = (exp.supplier || '').replace(/;/g, ',').replace(/"/g, '""');

        csv += `"${cat}";"${safeItem}";"${safeSupplier}";"${b}";"${pm}";"${pmi}";"${tot}";"${diff}";"${exp.status || ''}";"${safeNotes}"\n`;
      });

      return csv;
    }

    static download(csvContent, filename) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  class BackupService {
    static serialize(data) {
      return JSON.stringify(data, null, 2);
    }

    static deserialize(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || !parsed.couple || !Array.isArray(parsed.expenses)) {
          throw new Error('Struttura archivio non valida.');
        }
        return { success: true, data: parsed };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    static downloadJson(jsonDataString, filename) {
      const blob = new Blob([jsonDataString], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  class DateService {
    static formatItalianDate(date = new Date()) {
      const d = (date instanceof Date && !isNaN(date)) ? date : new Date();
      const formatted = new Intl.DateTimeFormat('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(d);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    static formatShortDate(date = new Date()) {
      const d = (date instanceof Date && !isNaN(date)) ? date : new Date();
      return new Intl.DateTimeFormat('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(d);
    }

    static formatMonthYear(date = new Date()) {
      const d = (date instanceof Date && !isNaN(date)) ? date : new Date();
      const str = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(d);
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static formatMonthYearShort(date = new Date()) {
      const d = (date instanceof Date && !isNaN(date)) ? date : new Date();
      const str = new Intl.DateTimeFormat('it-IT', { month: 'short', year: 'numeric' }).format(d);
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static isSameMonth(d1, d2) {
      if (!(d1 instanceof Date) || isNaN(d1) || !(d2 instanceof Date) || isNaN(d2)) return false;
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
    }

    static getDateFromElapsedMonths(startDateStr = '2025-10-10', elapsedMonths = 0) {
      const start = new Date(startDateStr);
      return new Date(start.getFullYear(), start.getMonth() + Number(elapsedMonths), 15);
    }

    static calculateMonthsTimeline(startDateStr = '2025-10-10', targetDateStr = '2027-07-02', currentDate = new Date()) {
      const start = new Date(startDateStr);
      const target = new Date(targetDateStr);
      const now = (currentDate instanceof Date && !isNaN(currentDate)) ? currentDate : new Date();

      const totalMonths = Math.max(1, (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth()));
      let elapsedMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
      elapsedMonths = Math.max(0, Math.min(totalMonths, elapsedMonths));

      let remainingMonths = Math.max(0, totalMonths - elapsedMonths);
      const progressPct = (elapsedMonths / totalMonths) * 100;
      const isRealToday = DateService.isSameMonth(now, new Date());

      return {
        elapsedMonths,
        remainingMonths,
        totalMonths,
        progressPct,
        currentDate: now,
        isRealToday,
        monthIndex: elapsedMonths,
        todayFormatted: DateService.formatItalianDate(now),
        todayShortFormatted: DateService.formatShortDate(now),
        monthYearFormatted: DateService.formatMonthYear(now),
        monthYearShortFormatted: DateService.formatMonthYearShort(now),
        isPassed: now >= target
      };
    }
  }

  class SecurityService {
    static PIN_STORAGE_KEY = 'matrimonio_mm_pin_hash';
    static SESSION_AUTH_KEY = 'matrimonio_mm_auth_active';
    // Hash SHA-256 predefinito per il PIN iniziale di sicurezza "0207" (data nozze 2 Luglio)
    static DEFAULT_HASH = '2e3c969e2e9b367ade00279743f88ea0e32f283152223e3d9aaf1c14669d7cbe';

    static async hashPin(pin) {
      const msgBuffer = new TextEncoder().encode(String(pin).trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static isConfigured() {
      return !!localStorage.getItem(this.PIN_STORAGE_KEY);
    }

    static getExpectedHash() {
      return localStorage.getItem(this.PIN_STORAGE_KEY) || this.DEFAULT_HASH;
    }

    static async verify(enteredPin) {
      const enteredHash = await this.hashPin(enteredPin);
      const isValid = (enteredHash === this.getExpectedHash());
      if (isValid) {
        sessionStorage.setItem(this.SESSION_AUTH_KEY, 'true');
      }
      return isValid;
    }

    static isAuthenticated() {
      return sessionStorage.getItem(this.SESSION_AUTH_KEY) === 'true';
    }

    static logout() {
      sessionStorage.removeItem(this.SESSION_AUTH_KEY);
    }

    static async changePin(newPin) {
      const newHash = await this.hashPin(newPin);
      localStorage.setItem(this.PIN_STORAGE_KEY, newHash);
      sessionStorage.setItem(this.SESSION_AUTH_KEY, 'true');
      return true;
    }
  }

  return {
    CurrencyFormatter,
    CountdownService,
    DateService,
    CsvExporterService,
    BackupService,
    SecurityService
  };
})();
