/**
 * UI / PRESENTATION LAYER — Viste e Componenti di Presentazione
 * Basato esclusivamente su classi semantiche, zero stili inline o patch.
 */

window.WeddingApp = window.WeddingApp || {};
window.WeddingApp.UI = (function () {
  'use strict';

  const { CurrencyFormatter } = window.WeddingApp.Services;

  const ICONS = {
    villa: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-4h4v4"/></svg>`,
    vestito: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-2 5-3 1-3-1z"/><path d="M9 9l-4 12h14l-4-12"/></svg>`,
    camera: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    fiori: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 0-4 4c0 3 4 6 4 6s4-3 4-6a4 4 0 0 0-4-4z"/><path d="M2 12a4 4 0 0 0 4 4c3 0 6-4 6-4s-3-4-6-4a4 4 0 0 0-4 4z"/><path d="M12 22a4 4 0 0 0 4-4c0-3-4-6-4-6s-4 3-4 6a4 4 0 0 0 4 4z"/><path d="M22 12a4 4 0 0 0-4-4c-3 0-6 4-6 4s3 4 6 4a4 4 0 0 0 4-4z"/></svg>`,
    musica: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    documenti: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    fedi: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>`,
    inviti: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    trasporti: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    viaggio: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>`,
    extra: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
  };

  class HeaderView {
    static updateCountdown({ days = 0, hours = 0, minutes = 0, isPassed = false, referenceDate = null } = {}, details = null) {
      const d = document.getElementById('countdown-days');
      const h = document.getElementById('countdown-hours');
      const m = document.getElementById('countdown-mins');

      if (d) d.textContent = isPassed ? '0' : days;
      if (h) h.textContent = isPassed ? '0' : hours;
      if (m) m.textContent = isPassed ? '0' : minutes;

      const dateEl = document.getElementById('header-current-date');
      if (dateEl && window.WeddingApp?.Services?.DateService) {
        dateEl.textContent = window.WeddingApp.Services.DateService.formatItalianDate(referenceDate || new Date());
      }

      if (details) {
        const guestsEl = document.getElementById('header-guests-count');
        const heroGuestsEl = document.getElementById('hero-guests-note');
        const count = details.estimatedGuests || 105;

        if (guestsEl) guestsEl.textContent = `${count} Ospiti`;
        if (heroGuestsEl) heroGuestsEl.textContent = count;
      }
    }
  }

  class FinancialHeroView {
    static render(finances) {
      if (!finances) return;

      const bEl = document.getElementById('metric-total-budget');
      const pEl = document.getElementById('metric-total-paid');
      const rEl = document.getElementById('metric-remaining');
      const paidBar = document.getElementById('flow-paid-segment');
      const remBar = document.getElementById('flow-rem-segment');
      const progText = document.getElementById('global-progress-text');

      if (bEl) bEl.textContent = CurrencyFormatter.format(finances.totalBudget || 0);
      if (pEl) pEl.textContent = CurrencyFormatter.format(finances.totalPaid || 0);
      if (rEl) rEl.textContent = CurrencyFormatter.format(finances.totalRemaining || 0);

      const pct = Math.min(100, Math.max(0, finances.progressPercentage || 0));
      if (paidBar) paidBar.style.width = `${pct}%`;
      if (remBar) remBar.style.width = `${100 - pct}%`;
      if (progText) progText.textContent = `${pct.toFixed(1)}%`;

      // Bilanciamento Quote
      const balance = finances.coupleBalance || { micheleAmount: 0, mirianaAmount: 0, micheleSharePct: 50, mirianaSharePct: 50 };
      const { micheleAmount, mirianaAmount, micheleSharePct, mirianaSharePct } = balance;
      const barM = document.getElementById('split-bar-michele');
      const barMir = document.getElementById('split-bar-miriana');
      const txtM = document.getElementById('split-txt-michele');
      const txtMir = document.getElementById('split-txt-miriana');

      if (barM) barM.style.width = `${micheleSharePct}%`;
      if (barMir) barMir.style.width = `${mirianaSharePct}%`;
      if (txtM) txtM.textContent = `Michele: ${CurrencyFormatter.format(micheleAmount)} (${Math.round(micheleSharePct)}%)`;
      if (txtMir) txtMir.textContent = `Miriana: ${CurrencyFormatter.format(mirianaAmount)} (${Math.round(mirianaSharePct)}%)`;
    }
  }

  class CategoryGalleryView {
    static render(categoryAggregates, onCategorySelect) {
      const container = document.getElementById('category-cards-grid');
      if (!container) return;

      const list = Object.values(categoryAggregates);
      container.innerHTML = list.map(item => {
        const cat = item.category;
        const progress = item.budget > 0 ? (item.totalPaid / item.budget) * 100 : 0;
        const clampedProg = Math.min(100, Math.max(0, progress));

        let statusLabel = 'In definizione';
        let statusClass = 'pianificato';
        if (progress >= 100 && item.budget > 0) {
          statusLabel = 'Completato';
          statusClass = 'saldato';
        } else if (item.totalPaid > 0) {
          statusLabel = 'In acconto';
          statusClass = 'acconto';
        }

        return `
          <div class="cat-atelier-card" data-cat-id="${cat.id}">
            <div class="cat-card-top">
              <div class="cat-card-name">${cat.name}</div>
              <div class="cat-card-icon-wrap">${ICONS[cat.icon] || ICONS.extra}</div>
            </div>
            <div>
              <div class="cat-card-amounts">
                <span class="cat-budget-main amount">${CurrencyFormatter.format(item.budget)}</span>
                <span class="cat-paid-sub amount">Anticipati: ${CurrencyFormatter.format(item.totalPaid)}</span>
              </div>
              <div class="cat-card-progress">
                <div class="cat-card-progress-fill" style="width: ${clampedProg}%; background: ${item.totalPaid > 0 ? 'var(--accent-sage)' : 'var(--accent-bronze)'};"></div>
              </div>
              <div class="cat-card-footer">
                <span class="badge-status ${statusClass}">${statusLabel}</span>
                <span>${item.count} ${item.count === 1 ? 'voce' : 'voci'}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.cat-atelier-card').forEach(card => {
        card.addEventListener('click', () => {
          if (typeof onCategorySelect === 'function') {
            onCategorySelect(card.dataset.catId);
          }
        });
      });
    }
  }

  class LedgerTableView {
    static render(expenses, categories, { onEdit, onDelete }) {
      const tbody = document.getElementById('expenses-table-body');
      if (!tbody) return;

      if (expenses.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="col-item" style="text-align: center; padding: 48px 20px; color: var(--ink-muted);">
              <div style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 6px; color: var(--ink-secondary);">
                Nessun servizio corrispondente
              </div>
              <p>Verifica i criteri di ricerca o inserisci una nuova voce.</p>
            </td>
          </tr>
        `;
        return;
      }

      const catMap = {};
      categories.forEach(c => { catMap[c.id] = c; });

      let currentCatId = null;
      let html = '';

      expenses.forEach(exp => {
        const cat = catMap[exp.categoryId] || { name: 'Altro', icon: 'extra' };
        const status = exp.resolveStatus();
        let statusLabel = 'In pianificazione';
        let statusClass = 'pianificato';

        if (status === 'saldato') {
          statusLabel = 'Completato';
          statusClass = 'saldato';
        } else if (status === 'acconto') {
          statusLabel = 'Acconto versato';
          statusClass = 'acconto';
        }

        let payerBadges = '';
        if (exp.paidMichele > 0) {
          payerBadges += `<span class="pill-person michele">Michele: ${CurrencyFormatter.format(exp.paidMichele)}</span>`;
        }
        if (exp.paidMiriana > 0) {
          payerBadges += `<span class="pill-person miriana">Miriana: ${CurrencyFormatter.format(exp.paidMiriana)}</span>`;
        }
        if (!payerBadges) {
          payerBadges = `<span class="badge-unpaid">In attesa</span>`;
        } else {
          payerBadges = `<div class="payer-badges-stack">${payerBadges}</div>`;
        }

        const remainingVal = exp.remaining();

        let splitBadge = '';
        if (exp.splitType === 'michele') {
          splitBadge = `<span class="split-type-pill michele">Solo Michele</span>`;
        } else if (exp.splitType === 'miriana') {
          splitBadge = `<span class="split-type-pill miriana">Solo Miriana</span>`;
        } else if (exp.splitType === 'guests') {
          splitBadge = `<span class="split-type-pill guests">Proporzionale Ospiti</span>`;
        } else {
          splitBadge = `<span class="split-type-pill equal">Comune 50/50</span>`;
        }

        const costTypeBadge = (exp.isEstimate === true || exp.isEstimate === 'true')
          ? `<span class="cost-nature-pill estimate" title="Costo stimato indicativo">📝 Stima</span>`
          : `<span class="cost-nature-pill contract" title="Costo reale contrattualizzato">🔒 Contratto</span>`;

        const staffBadge = (exp.staffCount && Number(exp.staffCount) > 0)
          ? `<span class="cost-nature-pill staff" title="${exp.staffCount} membri staff contati al catering al 50%">🍽️ ${exp.staffCount} staff</span>`
          : '';

        html += `
          <tr data-id="${exp.id}">
            <td class="col-item">
              <div class="item-title">${exp.item}</div>
              <div class="item-meta-row">
                ${exp.supplier ? `<span class="item-supplier">${exp.supplier}</span>` : ''}
                ${splitBadge}
                ${costTypeBadge}
                ${staffBadge}
              </div>
            </td>
            <td class="col-investment amount">${CurrencyFormatter.format(exp.budget)}</td>
            <td class="col-advanced">${payerBadges}</td>
            <td class="col-remaining amount ${remainingVal === 0 ? 'text-settled' : 'text-pending'}">
              ${remainingVal === 0 ? 'Saldato' : CurrencyFormatter.format(remainingVal)}
            </td>
            <td class="col-status">
              <span class="badge-status ${statusClass}">${statusLabel}</span>
            </td>
            <td class="col-notes">
              ${exp.notes ? `<span>${exp.notes}</span>` : '<span style="color: var(--ink-light);">—</span>'}
            </td>
            <td class="col-actions">
              <div class="row-actions-block">
                <button class="btn-row-action edit-expense-btn" title="Modifica" data-id="${exp.id}">
                  ${ICONS.edit}
                </button>
                <button class="btn-row-action delete delete-expense-btn" title="Rimuovi" data-id="${exp.id}">
                  ${ICONS.trash}
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = html;

      tbody.querySelectorAll('.edit-expense-btn').forEach(btn => {
        btn.addEventListener('click', () => onEdit(btn.dataset.id));
      });

      tbody.querySelectorAll('.delete-expense-btn').forEach(btn => {
        btn.addEventListener('click', () => onDelete(btn.dataset.id));
      });
    }
  }

  class SavingsPlanView {
    static render({ statements, coverage, timeline } = {}, { onEdit } = {}) {
      const dateEl = document.getElementById('savings-today-date');
      const monthsBadgeEl = document.getElementById('savings-months-left-badge');
      if (dateEl) {
        dateEl.textContent = timeline?.todayFormatted || (window.WeddingApp?.Services?.DateService ? window.WeddingApp.Services.DateService.formatItalianDate() : 'Oggi');
      }
      if (monthsBadgeEl && timeline) {
        monthsBadgeEl.textContent = String(timeline.remainingMonths);
      }

      const container = document.getElementById('savings-statements-container');
      if (container && statements && statements.michele && statements.miriana && statements.family) {
        const m = statements.michele;
        const mir = statements.miriana;
        const fam = statements.family;

        container.innerHTML = `
          <!-- SCHEDA MICHELE -->
          <div class="statement-card">
            <div>
              <div class="statement-header">
                <div>
                  <div class="statement-title">${m.title}</div>
                  <div class="statement-subtitle">${m.subtitle}</div>
                </div>
                <button type="button" class="btn-card-edit" data-card="michele" title="Modifica parametri Michele">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <span>Modifica</span>
                </button>
              </div>
              <div class="statement-divider-solid"></div>

              <div class="statement-rows">
                <div class="statement-row">
                  <span>Risparmio mensile</span>
                  <div>
                    <button type="button" class="value-box-dashed btn-editable-val" data-card="michele" title="Clicca per modificare">
                      ${m.monthlySavings} <span class="value-unit-text">€/mese</span>
                    </button>
                  </div>
                </div>

                <div class="statement-row">
                  <span>Dotazione iniziale</span>
                  <div>
                    <button type="button" class="value-box-dashed btn-editable-val" data-card="michele" title="Clicca per modificare">
                      ${CurrencyFormatter.format(m.initialSavings)}
                    </button>
                  </div>
                </div>

                <div class="statement-row">
                  <div class="statement-row-meta">
                    <span>Accumulo attuale (${m.currentMonths} mesi)</span>
                    <small class="formula-chip-hint">${m.monthlySavings}€ × ${m.currentMonths}m</small>
                  </div>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(m.currentAccumulated)}</strong>
                </div>

                <div class="statement-row border-thick">
                  <div class="statement-row-meta">
                    <span>Accumulo mancante (${m.remainingMonths} mesi)</span>
                    <small class="formula-chip-hint">${m.monthlySavings}€ × ${m.remainingMonths}m</small>
                  </div>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(m.remainingAccumulated)}</strong>
                </div>

                <div class="statement-row statement-row-bold">
                  <span>Totale Lordo Previsto Michele</span>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(m.grossProjected)}</strong>
                </div>

                <div class="statement-row">
                  <span>Spese già anticipate da Michele</span>
                  <span class="row-value-negative amount">- ${CurrencyFormatter.format(m.expensesPaid, { includeSymbol: false })} €</span>
                </div>

                <div class="statement-row">
                  <div class="statement-row-meta">
                    <span>Disponibilità attuale sul conto</span>
                    <small class="formula-chip-hint">Trade Republic: ETF + Liquidità</small>
                  </div>
                  <strong class="row-value-amount amount text-settled">${CurrencyFormatter.format(m.currentNetLiquidity)}</strong>
                </div>
              </div>
            </div>

            <div class="statement-footer-card">
              <div class="statement-footer-title">
                <span>Residuo Netto Finale</span>
              </div>
              <strong class="statement-footer-amount amount">${CurrencyFormatter.format(m.finalNetResidual)}</strong>
            </div>
          </div>

          <!-- SCHEDA MIRIANA -->
          <div class="statement-card">
            <div>
              <div class="statement-header">
                <div>
                  <div class="statement-title">${mir.title}</div>
                  <div class="statement-subtitle">CONTO PERSONALE & DOTE DEDICATA</div>
                </div>
                <button type="button" class="btn-card-edit" data-card="miriana" title="Modifica parametri Miriana">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <span>Modifica</span>
                </button>
              </div>
              <div class="statement-divider-solid"></div>

              <div class="statement-rows">
                <div class="statement-row">
                  <span>Risparmio mensile</span>
                  <div>
                    <button type="button" class="value-box-dashed btn-editable-val" data-card="miriana" title="Clicca per modificare">
                      ${mir.monthlySavings} <span class="value-unit-text">€/mese</span>
                    </button>
                  </div>
                </div>

                <div class="statement-row">
                  <span>Dotazione iniziale</span>
                  <div>
                    <button type="button" class="value-box-dashed btn-editable-val" data-card="miriana" title="Clicca per modificare">
                      ${CurrencyFormatter.format(mir.initialSavings)}
                    </button>
                  </div>
                </div>

                <div class="statement-row">
                  <div class="statement-row-meta">
                    <span>Accumulo attuale (${mir.currentMonths} mesi)</span>
                    <small class="formula-chip-hint">${mir.monthlySavings}€ × ${mir.currentMonths}m</small>
                  </div>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(mir.currentAccumulated)}</strong>
                </div>

                <div class="statement-row">
                  <div class="statement-row-meta">
                    <span>Accumulo mancante (${mir.remainingMonths} mesi)</span>
                    <small class="formula-chip-hint">${mir.monthlySavings}€ × ${mir.remainingMonths}m</small>
                  </div>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(mir.remainingAccumulated)}</strong>
                </div>

                <div class="statement-row statement-row-bold">
                  <span>Totale Risparmi Personali</span>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(mir.grossProjected)}</strong>
                </div>

                <div class="statement-row">
                  <div class="statement-row-meta">
                    <span>Dono Genitori (Amedeo & Anna)</span>
                    <small class="formula-chip-hint">1.500€ anticipati + 8.500€ a saldo</small>
                  </div>
                  <strong class="row-value-amount amount text-positive">+ ${CurrencyFormatter.format(mir.familyPledged || 10000)}</strong>
                </div>

                <div class="statement-row statement-row-bold border-thick">
                  <div class="statement-row-meta">
                    <span>Disponibilità Totale Miriana</span>
                    <small class="formula-chip-hint">Risparmi personali + Dono genitori</small>
                  </div>
                  <strong class="row-value-amount amount text-settled">${CurrencyFormatter.format(mir.grossProjected + (mir.familyPledged || 10000))}</strong>
                </div>

                <div class="statement-row">
                  <div class="statement-row-meta">
                    <span>Spese anticipate da Miriana</span>
                    <small class="formula-chip-hint">1.000€ personali + 1.500€ caparra genitori</small>
                  </div>
                  <span class="row-value-negative amount">- ${CurrencyFormatter.format(mir.expensesPaid + (fam.used || 1500), { includeSymbol: false })} €</span>
                </div>

                <div class="statement-row">
                  <span>Liquidità disponibile oggi</span>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(mir.currentNetLiquidity + fam.available)}</strong>
                </div>
              </div>
            </div>

            <div class="statement-footer-card">
              <div class="statement-footer-title">
                <span>Residuo Finale Stimato Miriana</span>
              </div>
              <strong class="statement-footer-amount amount">${CurrencyFormatter.format(mir.finalNetResidual + fam.available)}</strong>
            </div>
          </div>

          <!-- SCHEDA DONI & BUSTE INVITATI -->
          <div class="statement-card">
            <div>
              <div class="statement-header">
                <div>
                  <div class="statement-title">Regali & Doni Nozze</div>
                  <div class="statement-subtitle">STIMA BUSTE INVITATI</div>
                </div>
                <button type="button" class="btn-card-edit" data-card="family" title="Modifica stima doni">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <span>Modifica</span>
                </button>
              </div>
              <div class="statement-divider-solid"></div>

              <div class="statement-rows">
                <div class="statement-row">
                  <div class="statement-row-meta">
                    <span>Stima Doni Ospiti (${fam.giftsEstimated ? Math.round(fam.giftsEstimated / 100) : 105} invitati)</span>
                    <small class="formula-chip-hint">Media stimata 100€ a persona</small>
                  </div>
                  <div>
                    <button type="button" class="value-box-dashed btn-editable-val" data-card="family" title="Clicca per modificare">
                      ${CurrencyFormatter.format(fam.giftsEstimated)}
                    </button>
                  </div>
                </div>

                <div class="statement-row">
                  <span>Regali già ricevuti</span>
                  <span class="row-value-amount amount">0 €</span>
                </div>

                <div class="statement-row border-thick">
                  <div class="statement-row-meta">
                    <span>Destinazione Doni Ospiti</span>
                    <small class="formula-chip-hint">Margine di serenità e riserva coppia</small>
                  </div>
                  <strong class="row-value-amount amount text-settled">${CurrencyFormatter.format(fam.giftsEstimated)}</strong>
                </div>

                <div class="statement-row">
                  <div class="statement-row-meta">
                    <span>Nota su Stanziamento Genitori</span>
                    <small class="formula-chip-hint">10.000€ Amedeo & Anna</small>
                  </div>
                  <span class="text-settled font-semibold">Attribuito a Miriana</span>
                </div>
              </div>
            </div>

            <div class="statement-footer-card">
              <div class="statement-footer-title">
                <span>Totale Doni Stimati</span>
              </div>
              <strong class="statement-footer-amount amount">${CurrencyFormatter.format(fam.giftsEstimated)}</strong>
            </div>
          </div>
        `;

        if (typeof onEdit === 'function') {
          container.querySelectorAll('.btn-card-edit, .btn-editable-val').forEach(btn => {
            btn.addEventListener('click', () => onEdit(btn.dataset.card));
          });
        }
      }

      if (coverage) {
        const planBudgetRequired = document.getElementById('plan-budget-required');
        const planSafetyMargin = document.getElementById('plan-safety-margin');
        const planLiquidToday = document.getElementById('plan-liquid-today');
        const planStillToSave = document.getElementById('plan-still-to-save');
        const planStillToSaveNote = document.getElementById('plan-still-to-save-note');

        const goalStatusHeadline = document.getElementById('goal-status-headline');
        const goalTargetPct = document.getElementById('goal-target-pct');
        const goalProgressFill = document.getElementById('goal-progress-fill');

        if (planBudgetRequired) planBudgetRequired.textContent = CurrencyFormatter.format(coverage.totalBudgetRequired);
        if (planSafetyMargin) {
          planSafetyMargin.textContent = CurrencyFormatter.format(coverage.serenityMargin);
          planSafetyMargin.style.color = coverage.serenityMargin >= 0 ? 'var(--accent-sage)' : 'var(--accent-terracotta)';
        }

        if (planLiquidToday) {
          planLiquidToday.textContent = CurrencyFormatter.format(coverage.currentNetLiquidityToday || 0);
        }

        const still = coverage.stillToSaveToTarget || 0;
        const totalReq = coverage.totalBudgetRequired || 1;
        const savedSoFar = coverage.currentNetLiquidityToday || 0;
        const pct = Math.min(100, Math.max(0, Math.round((savedSoFar / totalReq) * 100)));

        if (goalTargetPct) goalTargetPct.textContent = `${pct}%`;
        if (goalProgressFill) goalProgressFill.style.width = `${pct}%`;

        if (still <= 0) {
          if (goalStatusHeadline) goalStatusHeadline.textContent = 'Traguardo Raggiunto: Tutte le spese sono già coperte!';
          if (planStillToSave) {
            planStillToSave.textContent = 'Copertura 100%';
            planStillToSave.style.color = 'var(--accent-sage)';
          }
          if (planStillToSaveNote) planStillToSaveNote.textContent = 'Fondi attuali già sufficienti';
        } else {
          if (goalStatusHeadline) {
            goalStatusHeadline.textContent = `Sei al ${pct}% dell'obiettivo: mancano ${CurrencyFormatter.format(still)} al traguardo`;
          }
          if (planStillToSave) {
            planStillToSave.textContent = CurrencyFormatter.format(still);
            planStillToSave.style.color = 'var(--accent-terracotta)';
          }
          if (planStillToSaveNote && coverage.remainingMonths) {
            const monthlyRate = Math.round(still / Math.max(1, coverage.remainingMonths));
            planStillToSaveNote.textContent = `Circa ${monthlyRate}€/mese nei prossimi ${coverage.remainingMonths} mesi`;
          }
        }

        // Render Traguardi Personali dei due sposi con Doppio Binario Semplicissimo
        if (coverage.personalGoals) {
          const pgM = coverage.personalGoals.michele;
          const pgMir = coverage.personalGoals.miriana;
          const remMonths = coverage.remainingMonths || 9;

          // Michele
          const gMHeadline = document.getElementById('goal-michele-headline');
          const gMPct = document.getElementById('goal-michele-pct');
          const gMFill = document.getElementById('goal-michele-fill');
          const gMTarget = document.getElementById('goal-michele-target');
          const gMSaved = document.getElementById('goal-michele-saved');
          const gMStill = document.getElementById('goal-michele-still');
          const gMIdealDesc = document.getElementById('goal-michele-ideal-desc');
          const gMRealDesc = document.getElementById('goal-michele-real-desc');
          const gMNeededRate = document.getElementById('goal-michele-needed-rate');

          if (pgM) {
            if (gMPct) gMPct.textContent = `${pgM.progressPct}%`;
            if (gMFill) gMFill.style.width = `${pgM.progressPct}%`;
            if (gMTarget) gMTarget.textContent = CurrencyFormatter.format(pgM.targetBudget);
            if (gMSaved) gMSaved.textContent = CurrencyFormatter.format(pgM.currentLiquidity);

            if (gMIdealDesc) {
              gMIdealDesc.textContent = `Piano originario: ${pgM.idealMonthlyRate} €/mese costanti`;
            }

            if (gMRealDesc) {
              const proj = pgM.projectedAtCurrentPace;
              gMRealDesc.textContent = `A ${pgM.plannedMonthlyRate} €/m arrivi a ${CurrencyFormatter.format(proj)} (${remMonths} mesi)`;
            }

            if (gMNeededRate) {
              if (pgM.stillToSave <= 0) {
                gMNeededRate.textContent = 'Spese già coperte!';
                gMNeededRate.className = 'p-row-val text-sage';
              } else {
                gMNeededRate.textContent = `${pgM.neededMonthlyRate} €/mese per ${remMonths} mesi`;
                gMNeededRate.className = 'p-row-val text-bronze';
              }
            }

            if (pgM.stillToSave <= 0) {
              if (gMHeadline) gMHeadline.textContent = 'Traguardo Raggiunto: le tue spese sono coperte!';
              if (gMStill) {
                gMStill.textContent = 'Coperto 100%';
                gMStill.className = 'p-row-val text-sage amount';
              }
            } else {
              if (gMHeadline) gMHeadline.textContent = `Sei al ${pgM.progressPct}%: mancano ${CurrencyFormatter.format(pgM.stillToSave)}`;
              if (gMStill) {
                gMStill.textContent = CurrencyFormatter.format(pgM.stillToSave);
                gMStill.className = 'p-row-val text-terracotta amount';
              }
            }
          }

          // Miriana
          const gMirHeadline = document.getElementById('goal-miriana-headline');
          const gMirPct = document.getElementById('goal-miriana-pct');
          const gMirFill = document.getElementById('goal-miriana-fill');
          const gMirTarget = document.getElementById('goal-miriana-target');
          const gMirSaved = document.getElementById('goal-miriana-saved');
          const gMirStill = document.getElementById('goal-miriana-still');
          const gMirIdealDesc = document.getElementById('goal-miriana-ideal-desc');
          const gMirRealDesc = document.getElementById('goal-miriana-real-desc');
          const gMirNeededRate = document.getElementById('goal-miriana-needed-rate');

          if (pgMir) {
            if (gMirPct) gMirPct.textContent = `${pgMir.progressPct}%`;
            if (gMirFill) gMirFill.style.width = `${pgMir.progressPct}%`;
            if (gMirTarget) gMirTarget.textContent = CurrencyFormatter.format(pgMir.targetBudgetNet);
            if (gMirSaved) gMirSaved.textContent = CurrencyFormatter.format(pgMir.currentLiquidity);

            if (gMirIdealDesc) {
              gMirIdealDesc.textContent = `Piano originario: ${pgMir.idealMonthlyRate} €/mese costanti`;
            }

            if (gMirRealDesc) {
              const proj = pgMir.projectedAtCurrentPace;
              gMirRealDesc.textContent = `A ${pgMir.plannedMonthlyRate} €/m arriva a ${CurrencyFormatter.format(proj)} (${remMonths} mesi)`;
            }

            if (gMirNeededRate) {
              if (pgMir.stillToSave <= 0) {
                gMirNeededRate.textContent = 'Spese già coperte!';
                gMirNeededRate.className = 'p-row-val text-sage';
              } else {
                gMirNeededRate.textContent = `${pgMir.neededMonthlyRate} €/mese per ${remMonths} mesi`;
                gMirNeededRate.className = 'p-row-val text-bronze';
              }
            }

            if (pgMir.stillToSave <= 0) {
              if (gMirHeadline) gMirHeadline.textContent = 'Traguardo Raggiunto: le sue spese sono coperte!';
              if (gMirStill) {
                gMirStill.textContent = 'Coperto 100%';
                gMirStill.className = 'p-row-val text-sage amount';
              }
            } else {
              if (gMirHeadline) gMirHeadline.textContent = `Sei all'${pgMir.progressPct}%: mancano ${CurrencyFormatter.format(pgMir.stillToSave)}`;
              if (gMirStill) {
                gMirStill.textContent = CurrencyFormatter.format(pgMir.stillToSave);
                gMirStill.className = 'p-row-val text-terracotta amount';
              }
            }
          }
        }
      }
    }
  }

  class SavingsPlanModalView {
    static init({ onSave }) {
      const modal = document.getElementById('savings-modal');
      const form = document.getElementById('savings-form');
      const btnClose = document.getElementById('close-savings-modal-btn');
      const btnCancel = document.getElementById('cancel-savings-btn');
      const autoCheckbox = document.getElementById('sp-auto-months-checkbox');

      const toggleMonthInputs = (isAuto) => {
        const monthInputIds = [
          'sp-michele-months-done',
          'sp-michele-months-todo',
          'sp-miriana-months-done',
          'sp-miriana-months-todo'
        ];
        monthInputIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.readOnly = isAuto;
            if (isAuto) el.classList.add('input-auto-locked');
            else el.classList.remove('input-auto-locked');
          }
        });
      };

      const guestsCountInput = document.getElementById('sp-guests-count');
      const giftsEstInput = document.getElementById('sp-gifts-estimated');

      if (guestsCountInput && giftsEstInput) {
        guestsCountInput.addEventListener('input', (e) => {
          const count = parseInt(e.target.value, 10);
          if (!isNaN(count) && count > 0) {
            giftsEstInput.value = count * 100;
          }
        });
      }

      if (autoCheckbox) {
        autoCheckbox.addEventListener('change', (e) => {
          toggleMonthInputs(e.target.checked);
        });
      }

      if (btnClose) {
        btnClose.addEventListener('click', () => SavingsPlanModalView.close());
      }
      if (btnCancel) {
        btnCancel.addEventListener('click', () => SavingsPlanModalView.close());
      }
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) SavingsPlanModalView.close();
        });
      }
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const isAuto = autoCheckbox ? autoCheckbox.checked : true;
          const formData = {
            estimatedGuests: parseInt(document.getElementById('sp-guests-count')?.value, 10) || 100,
            staffMealsCount: parseInt(document.getElementById('sp-staff-meals')?.value, 10) || 0,
            michele: {
              monthlySavings: parseFloat(document.getElementById('sp-michele-monthly')?.value) || 0,
              initialSavings: parseFloat(document.getElementById('sp-michele-initial')?.value) || 0,
              currentMonths: parseInt(document.getElementById('sp-michele-months-done')?.value, 10) || 0,
              remainingMonths: parseInt(document.getElementById('sp-michele-months-todo')?.value, 10) || 0,
              isManualMonths: !isAuto
            },
            miriana: {
              monthlySavings: parseFloat(document.getElementById('sp-miriana-monthly')?.value) || 0,
              initialSavings: parseFloat(document.getElementById('sp-miriana-initial')?.value) || 0,
              currentMonths: parseInt(document.getElementById('sp-miriana-months-done')?.value, 10) || 0,
              remainingMonths: parseInt(document.getElementById('sp-miriana-months-todo')?.value, 10) || 0,
              isManualMonths: !isAuto
            },
            familyContribution: {
              totalPledged: parseFloat(document.getElementById('sp-family-pledged')?.value) || 0,
              alreadyAdvanced: parseFloat(document.getElementById('sp-family-advanced')?.value) || 0
            },
            weddingGifts: {
              estimated: parseFloat(document.getElementById('sp-gifts-estimated')?.value) || 0
            }
          };
          if (typeof onSave === 'function') {
            onSave(formData);
          }
          SavingsPlanModalView.close();
        });
      }
    }

    static open(savingsPlan = {}, targetCard = 'all', timeline = null, details = null) {
      const modal = document.getElementById('savings-modal');
      if (!modal) return;

      const m = savingsPlan.michele || {};
      const mir = savingsPlan.miriana || {};
      const fam = savingsPlan.familyContribution || {};
      const gifts = savingsPlan.weddingGifts || {};

      const isManual = Boolean(m.isManualMonths || mir.isManualMonths);
      const autoCheckbox = document.getElementById('sp-auto-months-checkbox');

      if (autoCheckbox) {
        autoCheckbox.checked = !isManual;
        const monthInputIds = [
          'sp-michele-months-done',
          'sp-michele-months-todo',
          'sp-miriana-months-done',
          'sp-miriana-months-todo'
        ];
        monthInputIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.readOnly = !isManual;
            if (!isManual) el.classList.add('input-auto-locked');
            else el.classList.remove('input-auto-locked');
          }
        });
      }

      const syncText = document.getElementById('calendar-sync-timeline-text');
      if (syncText && timeline) {
        syncText.textContent = `Oggi: ${timeline.todayFormatted} • ${timeline.elapsedMonths} mesi trascorsi, ${timeline.remainingMonths} mesi al matrimonio (2 Luglio 2027)`;
      }

      const defaultElapsed = timeline?.elapsedMonths ?? 12;
      const defaultRemaining = timeline?.remainingMonths ?? 9;

      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = (val !== undefined && val !== null) ? val : 0;
      };

      setVal('sp-guests-count', details?.estimatedGuests ?? 100);
      setVal('sp-staff-meals', details?.staffMealsCount ?? 0);
      setVal('sp-michele-monthly', m.monthlySavings ?? 740);
      setVal('sp-michele-initial', m.initialSavings ?? 9000);
      setVal('sp-michele-months-done', isManual ? (m.currentMonths ?? defaultElapsed) : defaultElapsed);
      setVal('sp-michele-months-todo', isManual ? (m.remainingMonths ?? defaultRemaining) : defaultRemaining);

      setVal('sp-miriana-monthly', mir.monthlySavings ?? 400);
      setVal('sp-miriana-initial', mir.initialSavings ?? 5000);
      setVal('sp-miriana-months-done', isManual ? (mir.currentMonths ?? defaultElapsed) : defaultElapsed);
      setVal('sp-miriana-months-todo', isManual ? (mir.remainingMonths ?? defaultRemaining) : defaultRemaining);

      setVal('sp-family-pledged', fam.totalPledged ?? 10000);
      setVal('sp-family-advanced', fam.alreadyAdvanced ?? 1500);
      setVal('sp-gifts-estimated', gifts.estimated ?? 10000);

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') SavingsPlanModalView.close();
      });

      modal.classList.add('open');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        let focusId = 'sp-michele-monthly';
        if (targetCard === 'miriana') focusId = 'sp-miriana-monthly';
        if (targetCard === 'family') focusId = 'sp-family-pledged';
        const focusEl = document.getElementById(focusId);
        if (focusEl) {
          focusEl.focus();
          focusEl.select();
        }
      }, 50);
    }

    static close() {
      const modal = document.getElementById('savings-modal');
      if (modal) {
        modal.classList.remove('open');
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }

  class CoupleBalanceView {
    static render({ coupleBalance, expenses = [] } = {}) {
      if (!coupleBalance) return;

      const elPaidM = document.getElementById('balance-michele-paid');
      const elPctM = document.getElementById('balance-michele-pct');
      const elPaidMir = document.getElementById('balance-miriana-paid');
      const elPctMir = document.getElementById('balance-miriana-pct');
      const elSuggestion = document.getElementById('balance-suggestion-text');

      const elOwedM = document.getElementById('balance-owed-michele');
      const elOwedMir = document.getElementById('balance-owed-miriana');
      const elOwedMirSub = document.getElementById('balance-owed-miriana-sub');
      const elPaidHeroM = document.getElementById('balance-paid-michele-hero');
      const elPaidHeroMir = document.getElementById('balance-paid-miriana-hero');

      if (elOwedM) elOwedM.textContent = CurrencyFormatter.format(coupleBalance.micheleOwed || 0);
      if (elOwedMir) {
        // Se c'è la quota al netto del contributo genitori, mostriamo quella
        const displayOwedMir = (coupleBalance.mirianaNetOwed !== undefined) ? coupleBalance.mirianaNetOwed : (coupleBalance.mirianaOwed || 0);
        elOwedMir.textContent = CurrencyFormatter.format(displayOwedMir);
        if (elOwedMirSub && coupleBalance.familyContributionMiriana) {
          elOwedMirSub.textContent = `Quota residua (-${CurrencyFormatter.format(coupleBalance.familyContributionMiriana)} donati)`;
        }
      }
      if (elPaidHeroM) elPaidHeroM.textContent = CurrencyFormatter.format(coupleBalance.micheleAmount || 0);
      if (elPaidHeroMir) elPaidHeroMir.textContent = CurrencyFormatter.format(coupleBalance.mirianaAmount || 0);

      if (elPaidM) elPaidM.textContent = CurrencyFormatter.format(coupleBalance.micheleAmount || 0);
      if (elPctM) elPctM.textContent = `${Math.round(coupleBalance.micheleSharePct || 50)}% degli anticipi totali`;
      if (elPaidMir) elPaidMir.textContent = CurrencyFormatter.format(coupleBalance.mirianaAmount || 0);
      if (elPctMir) elPctMir.textContent = `${Math.round(coupleBalance.mirianaSharePct || 50)}% degli anticipi totali`;

      if (elSuggestion && coupleBalance.compensationAdvice) {
        elSuggestion.textContent = coupleBalance.compensationAdvice.message || '';
      }

      const listM = document.getElementById('list-michele-items');
      const listMir = document.getElementById('list-miriana-items');
      const badgeCountM = document.getElementById('badge-count-michele');
      const badgeCountMir = document.getElementById('badge-count-miriana');

      const expensesM = expenses.filter(e => e.paidMichele > 0);
      const expensesMir = expenses.filter(e => e.paidMiriana > 0);

      if (badgeCountM) badgeCountM.textContent = `${expensesM.length} ${expensesM.length === 1 ? 'voce' : 'voci'}`;
      if (badgeCountMir) badgeCountMir.textContent = `${expensesMir.length} ${expensesMir.length === 1 ? 'voce' : 'voci'}`;

      if (listM) {
        if (expensesM.length === 0) {
          listM.innerHTML = `<div class="balance-item-empty">Nessun anticipo registrato per Michele.</div>`;
        } else {
          listM.innerHTML = expensesM.map(exp => `
            <div class="balance-expense-chip">
              <div class="balance-chip-info">
                <div class="balance-chip-title">${exp.item}</div>
                ${exp.supplier ? `<div class="balance-chip-supplier">${exp.supplier}</div>` : ''}
              </div>
              <div class="balance-chip-amount michele amount">${CurrencyFormatter.format(exp.paidMichele)}</div>
            </div>
          `).join('');
        }
      }

      if (listMir) {
        if (expensesMir.length === 0) {
          listMir.innerHTML = `<div class="balance-item-empty">Nessun anticipo registrato per Miriana.</div>`;
        } else {
          listMir.innerHTML = expensesMir.map(exp => `
            <div class="balance-expense-chip">
              <div class="balance-chip-info">
                <div class="balance-chip-title">${exp.item}</div>
                ${exp.supplier ? `<div class="balance-chip-supplier">${exp.supplier}</div>` : ''}
              </div>
              <div class="balance-chip-amount miriana amount">${CurrencyFormatter.format(exp.paidMiriana)}</div>
            </div>
          `).join('');
        }
      }
    }
  }

  class TimelineView {
    static render(timeline, { onTimeChange, onResetToday } = {}) {
      if (!timeline) return;

      const badgeLabel = document.getElementById('timeline-badge-label');
      const badgeWrap = document.getElementById('timeline-status-badge');
      const headlineDate = document.getElementById('timeline-headline-date');
      const statElapsed = document.getElementById('timeline-stat-elapsed');
      const statRemaining = document.getElementById('timeline-stat-remaining');
      const statPct = document.getElementById('timeline-stat-pct');
      const slider = document.getElementById('timeline-slider');

      if (headlineDate) headlineDate.textContent = timeline.monthYearFormatted || '';
      if (statElapsed) statElapsed.textContent = `${timeline.elapsedMonths} ${timeline.elapsedMonths === 1 ? 'mese trascorso' : 'mesi trascorsi'}`;
      if (statRemaining) statRemaining.textContent = `${timeline.remainingMonths} ${timeline.remainingMonths === 1 ? 'mese mancante' : 'mesi mancanti'}`;
      if (statPct) statPct.textContent = `${Math.round(timeline.progressPct || 0)}%`;

      if (badgeLabel && badgeWrap) {
        if (timeline.isRealToday) {
          badgeLabel.textContent = 'Tempo Reale';
          badgeWrap.classList.remove('simulation-mode');
        } else {
          badgeLabel.textContent = `Simulazione: ${timeline.monthYearShortFormatted}`;
          badgeWrap.classList.add('simulation-mode');
        }
      }

      if (slider && Number(slider.value) !== timeline.elapsedMonths) {
        slider.value = timeline.elapsedMonths;
      }

      const prevBtn = document.getElementById('btn-timeline-prev');
      const nextBtn = document.getElementById('btn-timeline-next');
      if (prevBtn) prevBtn.disabled = timeline.elapsedMonths <= 0;
      if (nextBtn) nextBtn.disabled = timeline.elapsedMonths >= (timeline.totalMonths || 21);

      if (!TimelineView._initialized) {
        TimelineView._initialized = true;

        if (slider) {
          slider.addEventListener('input', (e) => {
            const months = parseInt(e.target.value, 10);
            if (typeof onTimeChange === 'function') onTimeChange(months);
          });
        }

        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            const current = slider ? parseInt(slider.value, 10) : 12;
            if (current > 0 && typeof onTimeChange === 'function') {
              onTimeChange(current - 1);
            }
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            const current = slider ? parseInt(slider.value, 10) : 12;
            if (current < (timeline.totalMonths || 21) && typeof onTimeChange === 'function') {
              onTimeChange(current + 1);
            }
          });
        }

        const resetBtn = document.getElementById('btn-timeline-reset');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (typeof onResetToday === 'function') onResetToday();
          });
        }

        document.querySelectorAll('.timeline-tick').forEach(tick => {
          tick.addEventListener('click', () => {
            const m = parseInt(tick.dataset.month, 10);
            if (!isNaN(m) && typeof onTimeChange === 'function') onTimeChange(m);
          });
        });
      }
    }
  }

  class ToastView {
    static show(message, { onUndo = null, undoText = 'Annulla', duration = 5000 } = {}) {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'toast-note';

      const textSpan = document.createElement('span');
      textSpan.textContent = message;
      toast.appendChild(textSpan);

      if (typeof onUndo === 'function') {
        const undoBtn = document.createElement('button');
        undoBtn.type = 'button';
        undoBtn.className = 'toast-undo-btn';
        undoBtn.textContent = undoText;
        undoBtn.addEventListener('click', () => {
          try {
            onUndo();
          } catch (err) {
            console.error('Errore durante operazione di annulla:', err);
          }
          toast.remove();
        });
        toast.appendChild(undoBtn);
      }

      container.appendChild(toast);

      const timeoutDuration = onUndo ? Math.max(duration, 5000) : 3000;
      setTimeout(() => {
        if (!toast.parentElement) return;
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, timeoutDuration);
    }
  }

  class GuestsView {
    static render({ guests = [], finances = null } = {}, { onEdit, onDelete, onToggleGift } = {}) {
      const totalEl = document.getElementById('guests-total-count');
      const breakdownEl = document.getElementById('guests-breakdown-sub');
      const segM = document.getElementById('ratio-seg-michele');
      const segMir = document.getElementById('ratio-seg-miriana');
      const pctM = document.getElementById('ratio-pct-michele');
      const pctMir = document.getElementById('ratio-pct-miriana');
      const totalGiftsEl = document.getElementById('guests-total-gifts');
      const receivedGiftsEl = document.getElementById('guests-gifts-received');
      const grid = document.getElementById('guests-grid-container');

      const stats = finances?.coupleBalance?.guestStats || {
        totalGuests: guests.reduce((sum, g) => sum + (Number(g.count) || 1), 0),
        micheleGuests: guests.filter(g => g.party === 'michele').reduce((sum, g) => sum + (Number(g.count) || 1), 0),
        mirianaGuests: guests.filter(g => g.party === 'miriana').reduce((sum, g) => sum + (Number(g.count) || 1), 0),
        bothGuests: guests.filter(g => g.party === 'both').reduce((sum, g) => sum + (Number(g.count) || 1), 0),
        giftsTotalProjected: guests.reduce((sum, g) => sum + (Number(g.gift) || (Number(g.count) * 100)), 0),
        giftsTotalReceived: guests.filter(g => g.isGiftReceived).reduce((sum, g) => sum + (Number(g.gift) || (Number(g.count) * 100)), 0),
        micheleRatio: 0.5
      };

      if (totalEl) totalEl.textContent = stats.totalGuests;
      if (breakdownEl) {
        breakdownEl.textContent = `${stats.micheleGuests} Michele • ${stats.mirianaGuests} Miriana • ${stats.bothGuests} Insieme`;
      }

      const pM = Math.round(stats.micheleRatio * 100);
      const pMir = 100 - pM;

      if (segM) segM.style.width = `${pM}%`;
      if (segMir) segMir.style.width = `${pMir}%`;
      if (pctM) pctM.textContent = `${pM}%`;
      if (pctMir) pctMir.textContent = `${pMir}%`;

      if (totalGiftsEl) totalGiftsEl.textContent = CurrencyFormatter.format(stats.giftsTotalProjected);
      if (receivedGiftsEl) receivedGiftsEl.textContent = CurrencyFormatter.format(stats.giftsTotalReceived);

      if (!grid) return;

      if (!guests || guests.length === 0) {
        grid.innerHTML = `
          <div class="guests-empty-state">
            <div class="empty-state-title">Nessun invitato presente con i filtri attuali</div>
            <div class="empty-state-sub">Tocca "+ Nuovo Invitato" per aggiungere persone o famiglie e gestire i doni.</div>
          </div>
        `;
        return;
      }

      const escape = (str) => (window.WeddingApp && window.WeddingApp.Services && window.WeddingApp.Services.SecurityService) 
        ? window.WeddingApp.Services.SecurityService.escapeHtml(str) 
        : String(str || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

      grid.innerHTML = guests.map(g => {
        const partyLabel = g.party === 'michele' ? 'Lato Michele' : (g.party === 'miriana' ? 'Lato Miriana' : 'Amici Comuni');
        const partyClass = g.party === 'michele' ? 'michele' : (g.party === 'miriana' ? 'miriana' : 'both');
        const giftVal = Number(g.gift) || (Number(g.adultsCount !== undefined ? g.adultsCount : g.count) * 100);
        const isReceived = Boolean(g.isGiftReceived);

        const adults = g.adultsCount !== undefined ? Number(g.adultsCount) : (g.guestType === 'child' ? 0 : (Number(g.count) || 1));
        const children = g.childrenCount !== undefined ? Number(g.childrenCount) : (g.guestType === 'child' ? (Number(g.count) || 1) : 0);
        const totalPeople = adults + children;

        let compositionBadge = '';
        if (adults > 0 && children > 0) {
          compositionBadge = `<span class="guest-menu-pill family" title="${adults} adulti e ${children} bambini">Famiglia (${adults} ad. + ${children} bamb.)</span>`;
        } else if (children > 0 && adults === 0) {
          compositionBadge = `<span class="guest-menu-pill child" title="Menù Bambino 50%">Bambino (50%)</span>`;
        } else if (adults > 1) {
          compositionBadge = `<span class="guest-menu-pill adult">${adults} Adulti</span>`;
        } else {
          compositionBadge = `<span class="guest-menu-pill adult">Adulto</span>`;
        }

        const safeName = escape(g.name);
        const safeNotes = escape(g.notes);
        const safeId = escape(g.id);

        return `
          <div class="guest-card" data-id="${safeId}">
            <div class="guest-card-header">
              <div>
                <span class="guest-party-pill ${partyClass}">${partyLabel}</span>
                ${compositionBadge}
                <h4 class="guest-name">${safeName}</h4>
              </div>
              <div class="guest-count-badge">${totalPeople} ${totalPeople === 1 ? 'coperto' : 'coperti'}</div>
            </div>

            <div class="guest-card-body">
              <div class="guest-gift-row">
                <div class="guest-gift-info">
                  <span class="gift-caption">Valore Dono:</span>
                  <strong class="gift-amount amount">${CurrencyFormatter.format(giftVal)}</strong>
                </div>
                <button type="button" class="btn-gift-status ${isReceived ? 'is-received' : 'is-pending'}" data-action="toggle-gift" data-id="${safeId}">
                  ${isReceived ? '✓ Ricevuto' : 'In Sospeso'}
                </button>
              </div>
              ${safeNotes ? `<div class="guest-notes-line">${safeNotes}</div>` : ''}
            </div>

            <div class="guest-card-actions">
              <button type="button" class="btn-guest-action" data-action="edit" data-id="${g.id}">
                ${ICONS.edit} <span>Modifica</span>
              </button>
              <button type="button" class="btn-guest-action delete" data-action="delete" data-id="${g.id}">
                ${ICONS.trash} <span>Rimuovi</span>
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Event delegation
      grid.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          const id = btn.dataset.id;
          if (action === 'edit' && typeof onEdit === 'function') onEdit(id);
          if (action === 'delete' && typeof onDelete === 'function') onDelete(id);
          if (action === 'toggle-gift' && typeof onToggleGift === 'function') onToggleGift(id);
        });
      });
    }
  }

  class GuestModalView {
    static init({ onSave } = {}) {
      const modal = document.getElementById('guest-modal');
      const form = document.getElementById('guest-form');
      const closeBtn = document.getElementById('guest-modal-close-btn');
      const cancelBtn = document.getElementById('guest-modal-cancel-btn');
      const btnAdultsDec = document.getElementById('btn-adults-dec');
      const btnAdultsInc = document.getElementById('btn-adults-inc');
      const adultsInput = document.getElementById('guest-adults-count');
      const btnChildrenDec = document.getElementById('btn-children-dec');
      const btnChildrenInc = document.getElementById('btn-children-inc');
      const childrenInput = document.getElementById('guest-children-count');
      const giftInput = document.getElementById('guest-gift');
      const summaryText = document.getElementById('guest-coperti-summary');

      const updateSummaryAndGift = () => {
        const adults = Math.max(0, parseInt(adultsInput.value, 10) || 0);
        const children = Math.max(0, parseInt(childrenInput.value, 10) || 0);
        const total = adults + children;

        if (summaryText) {
          summaryText.textContent = `Totale coperti a tavola: ${total} ${total === 1 ? 'persona' : 'persone'} (${adults} ${adults === 1 ? 'adulto' : 'adulti'}, ${children} ${children === 1 ? 'bambino' : 'bambini'})`;
        }

        // Il regalo predefinito calcola 100€ SOLO per ciascun adulto (i bambini sono esclusi)
        if (giftInput && !giftInput.dataset.manual) {
          giftInput.value = adults * 100;
        }
      };

      if (btnAdultsDec && adultsInput) {
        btnAdultsDec.addEventListener('click', () => {
          adultsInput.value = Math.max(0, (parseInt(adultsInput.value, 10) || 0) - 1);
          updateSummaryAndGift();
        });
      }

      if (btnAdultsInc && adultsInput) {
        btnAdultsInc.addEventListener('click', () => {
          adultsInput.value = Math.min(20, (parseInt(adultsInput.value, 10) || 0) + 1);
          updateSummaryAndGift();
        });
      }

      if (btnChildrenDec && childrenInput) {
        btnChildrenDec.addEventListener('click', () => {
          childrenInput.value = Math.max(0, (parseInt(childrenInput.value, 10) || 0) - 1);
          updateSummaryAndGift();
        });
      }

      if (btnChildrenInc && childrenInput) {
        btnChildrenInc.addEventListener('click', () => {
          childrenInput.value = Math.min(20, (parseInt(childrenInput.value, 10) || 0) + 1);
          updateSummaryAndGift();
        });
      }

      if (adultsInput) adultsInput.addEventListener('input', updateSummaryAndGift);
      if (childrenInput) childrenInput.addEventListener('input', updateSummaryAndGift);

      if (giftInput) {
        giftInput.addEventListener('input', () => {
          giftInput.dataset.manual = 'true';
        });
      }

      if (closeBtn) closeBtn.addEventListener('click', () => GuestModalView.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => GuestModalView.close());
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) GuestModalView.close();
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const id = GuestModalView._currentId;
          const name = document.getElementById('guest-name').value.trim();
          const party = document.getElementById('guest-party').value;
          const adultsCount = Math.max(0, parseInt(adultsInput.value, 10) || 0);
          const childrenCount = Math.max(0, parseInt(childrenInput.value, 10) || 0);
          const totalCount = Math.max(1, adultsCount + childrenCount);
          const gift = parseFloat(giftInput.value) || 0;
          const isGiftReceived = document.getElementById('guest-gift-status').value === 'received';
          const notes = document.getElementById('guest-notes').value.trim();

          const guestType = (childrenCount > 0 && adultsCount > 0)
            ? 'family'
            : (childrenCount > 0 && adultsCount === 0 ? 'child' : 'adult');

          if (typeof onSave === 'function') {
            onSave({
              id,
              name,
              party,
              count: totalCount,
              adultsCount,
              childrenCount,
              guestType,
              gift,
              isGiftReceived,
              isGiftCustom: Boolean(giftInput.dataset.manual),
              notes
            });
          }
          GuestModalView.close();
        });
      }
    }

    static open(guest = null) {
      const modal = document.getElementById('guest-modal');
      const title = document.getElementById('guest-modal-title');
      const form = document.getElementById('guest-form');
      const giftInput = document.getElementById('guest-gift');
      const adultsInput = document.getElementById('guest-adults-count');
      const childrenInput = document.getElementById('guest-children-count');
      const summaryText = document.getElementById('guest-coperti-summary');
      if (!modal) return;

      GuestModalView._currentId = guest ? guest.id : null;

      if (guest) {
        if (title) title.textContent = 'Modifica Invitato o Famiglia';
        document.getElementById('guest-name').value = guest.name || '';
        document.getElementById('guest-party').value = guest.party || 'both';

        const isChild = (guest.guestType === 'child' || (guest.notes || '').toLowerCase().includes('bambin'));
        const adults = guest.adultsCount !== undefined ? Number(guest.adultsCount) : (isChild ? 0 : (Number(guest.count) || 1));
        const children = guest.childrenCount !== undefined ? Number(guest.childrenCount) : (isChild ? (Number(guest.count) || 1) : 0);

        if (adultsInput) adultsInput.value = adults;
        if (childrenInput) childrenInput.value = children;

        const total = adults + children;
        if (summaryText) {
          summaryText.textContent = `Totale coperti a tavola: ${total} ${total === 1 ? 'persona' : 'persone'} (${adults} ${adults === 1 ? 'adulto' : 'adulti'}, ${children} ${children === 1 ? 'bambino' : 'bambini'})`;
        }

        const defaultGift = adults * 100;
        document.getElementById('guest-gift').value = guest.gift !== undefined ? guest.gift : defaultGift;
        document.getElementById('guest-gift-status').value = guest.isGiftReceived ? 'received' : 'pending';
        document.getElementById('guest-notes').value = guest.notes || '';
        if (giftInput) giftInput.dataset.manual = guest.isGiftCustom ? 'true' : '';
      } else {
        if (title) title.textContent = 'Nuovo Invitato o Famiglia';
        if (form) form.reset();
        if (adultsInput) adultsInput.value = 1;
        if (childrenInput) childrenInput.value = 0;
        document.getElementById('guest-party').value = 'both';
        document.getElementById('guest-gift').value = 100;
        document.getElementById('guest-gift-status').value = 'pending';
        if (summaryText) {
          summaryText.textContent = 'Totale coperti a tavola: 1 persona (1 adulto, 0 bambini)';
        }
        if (giftInput) delete giftInput.dataset.manual;
      }

      modal.classList.add('open');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        const nameInput = document.getElementById('guest-name');
        if (nameInput) {
          nameInput.focus();
          nameInput.select();
        }
      }, 100);
    }

    static close() {
      const modal = document.getElementById('guest-modal');
      if (modal) {
        modal.classList.remove('open');
        modal.classList.remove('active');
      }
      document.body.style.overflow = '';
      GuestModalView._currentId = null;
    }
  }

  return {
    HeaderView,
    FinancialHeroView,
    CategoryGalleryView,
    LedgerTableView,
    SavingsPlanView,
    SavingsPlanModalView,
    CoupleBalanceView,
    TimelineView,
    GuestsView,
    GuestModalView,
    ToastView
  };
})();
