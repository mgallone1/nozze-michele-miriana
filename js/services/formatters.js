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
      if (!targetDateString) {
        targetDateString = '2027-07-02';
      }
      const safeTime = targetTimeString || '17:00';
      // Sostituzione per garantire parsing affidabile su Safari / iOS (evita bug ISO string)
      const targetParts = targetDateString.split('-');
      const timeParts = safeTime.split(':');
      const target = new Date(
        parseInt(targetParts[0], 10),
        parseInt(targetParts[1], 10) - 1,
        parseInt(targetParts[2], 10),
        parseInt(timeParts[0] || '17', 10),
        parseInt(timeParts[1] || '0', 10),
        0
      );

      const now = (referenceDate instanceof Date && !isNaN(referenceDate.getTime())) ? referenceDate : new Date();
      const diff = target.getTime() - now.getTime();

      if (isNaN(diff) || diff <= 0) {
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
    static PIN_STORAGE_KEY = 'matrimonio_mm_pin_pbkdf2_v2';
    static SESSION_AUTH_KEY = 'matrimonio_mm_auth_active';
    static WEBAUTHN_ID_KEY = 'matrimonio_mm_webauthn_cred_id';
    static RATE_LIMIT_STORAGE_KEY = 'matrimonio_mm_auth_attempts';

    // Salt crittografico dedicato e deterministico per l'Atelier
    static CRYPTO_SALT = new TextEncoder().encode('nozze_mm_atelier_salt_2027');
    static PBKDF2_ITERATIONS = 5000; // Istantaneo su mobile (< 5ms) con protezione anti-bruteforce a 5 tentativi

    // Hash PBKDF2-HMAC-SHA256 (5.000 iterazioni) per il PIN predefinito a 6 cifre "020727"
    static DEFAULT_HASH = 'c8a2851d021bfa66e3cd556b9394a4fb3412a5edb1da836a41011a6236abfb87';
    // Hash legacy a 600.000 iterazioni per retrocompatibilità automatica
    static LEGACY_HASH_600K = 'a9391465d635a6a0949970493bbf9357db9804e0432ce426b668b402dca19c97';

    static escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    static sanitizeUrl(url) {
      if (!url) return '';
      const clean = String(url).trim();
      if (/^(https?:|mailto:|tel:)/i.test(clean)) {
        return clean;
      }
      return '#';
    }

    // Derivazione crittografica PBKDF2-HMAC-SHA256 rapida ed ergonomica
    static async hashPin(pin, iterations = this.PBKDF2_ITERATIONS) {
      const pinStr = String(pin).trim();
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(pinStr),
        'PBKDF2',
        false,
        ['deriveBits']
      );
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: this.CRYPTO_SALT,
          iterations: Number(iterations) || this.PBKDF2_ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        256
      );
      const hashArray = Array.from(new Uint8Array(derivedBits));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static isConfigured() {
      return !!localStorage.getItem(this.PIN_STORAGE_KEY);
    }

    static getExpectedHash() {
      return localStorage.getItem(this.PIN_STORAGE_KEY) || this.DEFAULT_HASH;
    }

    // Rate Limiting & Anti-Bruteforce Defense (Check 08 & Check 12)
    static getAttemptsState() {
      try {
        const raw = localStorage.getItem(this.RATE_LIMIT_STORAGE_KEY);
        if (!raw) return { count: 0, lockUntil: 0 };
        return JSON.parse(raw);
      } catch (e) {
        return { count: 0, lockUntil: 0 };
      }
    }

    static isLocked() {
      const state = this.getAttemptsState();
      const now = Date.now();
      if (state.lockUntil && now < state.lockUntil) {
        const remainingMinutes = Math.ceil((state.lockUntil - now) / 60000);
        return { locked: true, remainingMinutes };
      }
      return { locked: false, remainingMinutes: 0 };
    }

    static registerFailedAttempt() {
      const state = this.getAttemptsState();
      state.count = (state.count || 0) + 1;
      // Al 5° tentativo fallito blocco per 15 minuti (Check 08)
      if (state.count >= 5) {
        state.lockUntil = Date.now() + (15 * 60 * 1000);
        console.warn(`[SECURITY ALERT] 5 tentativi PIN errati consecutivi. Blocco temporaneo attivato per 15 minuti.`);
      }
      localStorage.setItem(this.RATE_LIMIT_STORAGE_KEY, JSON.stringify(state));
      return state;
    }

    static resetAttempts() {
      localStorage.removeItem(this.RATE_LIMIT_STORAGE_KEY);
    }

    static async verify(enteredPin) {
      const lockCheck = this.isLocked();
      if (lockCheck.locked) {
        return { success: false, locked: true, remainingMinutes: lockCheck.remainingMinutes };
      }

      const expected = this.getExpectedHash();
      // Calcolo rapido a 5.000 iterazioni
      const enteredHashFast = await this.hashPin(enteredPin, 5000);
      let isValid = (enteredHashFast === expected);

      // Fallback trasparente: se l'hash memorizzato era a 600k iterazioni
      if (!isValid && (expected === this.LEGACY_HASH_600K || expected.length === 64)) {
        const enteredHashLegacy = await this.hashPin(enteredPin, 600000);
        if (enteredHashLegacy === expected) {
          isValid = true;
          // Upgrade automatico alla versione rapida
          localStorage.setItem(this.PIN_STORAGE_KEY, enteredHashFast);
          this.syncPinToCloud(enteredHashFast);
        }
      }

      if (isValid) {
        this.resetAttempts();
        sessionStorage.setItem(this.SESSION_AUTH_KEY, 'true');
        return { success: true };
      } else {
        const state = this.registerFailedAttempt();
        const isNowLocked = (state.count >= 5);
        return { 
          success: false, 
          locked: isNowLocked, 
          remainingMinutes: isNowLocked ? 15 : 0, 
          attemptsLeft: Math.max(0, 5 - state.count) 
        };
      }
    }

    static isAuthenticated() {
      return sessionStorage.getItem(this.SESSION_AUTH_KEY) === 'true';
    }

    static logout() {
      sessionStorage.removeItem(this.SESSION_AUTH_KEY);
    }

    static async changePin(newPin) {
      const clean = String(newPin).trim();
      if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
        throw new Error('Il PIN deve essere esattamente di 6 cifre numeriche.');
      }
      const newHash = await this.hashPin(clean);
      localStorage.setItem(this.PIN_STORAGE_KEY, newHash);
      this.resetAttempts();
      sessionStorage.setItem(this.SESSION_AUTH_KEY, 'true');

      // Sincronizza hash PIN su Supabase per PWA e tutti i dispositivi
      this.syncPinToCloud(newHash);
      return true;
    }

    static async syncPinToCloud(hash) {
      try {
        const SUPABASE_URL = 'https://rpccqbydibkmkpmrlxgv.supabase.co/rest/v1/wedding_vault';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwY2NxYnlkaWJrbWtwbXJseGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MDI1OTUsImV4cCI6MjEwODk3ODU5NX0.1Gz2KzPHDCUq4ub_5OY5RuUz3eRQ6G3-p33GXyxojro';
        const VAULT_ID = 'matrimonio_mm_vault_master';

        const getRes = await fetch(`${SUPABASE_URL}?id=eq.${VAULT_ID}&select=*`, {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (getRes.ok) {
          const recs = await getRes.json();
          if (recs && recs[0] && recs[0].data) {
            const data = recs[0].data;
            data.security = data.security || {};
            data.security.pinHash = hash;
            data.security.updatedAt = new Date().toISOString();

            await fetch(`${SUPABASE_URL}?id=eq.${VAULT_ID}`, {
              method: 'PATCH',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ data, updated_at: new Date().toISOString() })
            });
          }
        }
      } catch (err) {
        console.warn('Sync PIN su cloud non riuscito (offline o rete lenta):', err);
      }
    }

    // Supporto Biometrico WebAuthn / Face ID / Touch ID
    static async isBiometricsAvailable() {
      if (typeof window === 'undefined' || !window.PublicKeyCredential) {
        return false;
      }
      try {
        if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
          return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        }
        return false;
      } catch (err) {
        return false;
      }
    }

    static isBiometricsEnrolled() {
      return !!localStorage.getItem(this.WEBAUTHN_ID_KEY);
    }

    static async enrollBiometrics() {
      const available = await this.isBiometricsAvailable();
      if (!available) {
        throw new Error('Sensore Face ID / Touch ID non rilevato su questo dispositivo.');
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: { name: 'Atelier Nozze M&M' },
          user: {
            id: userId,
            name: 'sposi@nozze-mm.it',
            displayName: 'Michele & Miriana'
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },  // ES256
            { type: 'public-key', alg: -257 } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            residentKey: 'preferred'
          },
          timeout: 60000
        }
      });

      if (credential && credential.id) {
        localStorage.setItem(this.WEBAUTHN_ID_KEY, credential.id);
        sessionStorage.setItem(this.SESSION_AUTH_KEY, 'true');
        return true;
      }
      return false;
    }

    static async verifyBiometrics() {
      const credId = localStorage.getItem(this.WEBAUTHN_ID_KEY);
      if (!credId) {
        // Se non ancora registrato, proviamo ad enrollare e loggare contestualmente
        return await this.enrollBiometrics();
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Decodifica l'ID credenziale
      const idBytes = Uint8Array.from(atob(credId.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          allowCredentials: [{
            id: idBytes,
            type: 'public-key',
            transports: ['internal']
          }],
          userVerification: 'required',
          timeout: 60000
        }
      });

      if (assertion) {
        this.resetAttempts();
        sessionStorage.setItem(this.SESSION_AUTH_KEY, 'true');
        return true;
      }
      return false;
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
