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
    static updateCountdown({ days = 0, hours = 0, minutes = 0, isPassed = false, referenceDate = null } = {}) {
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
          payerBadges = `<span class="badge-unpaid">Da definire</span>`;
        } else {
          payerBadges = `<div class="payer-badges-stack">${payerBadges}</div>`;
        }

        const remainingVal = exp.remaining();

        html += `
          <tr data-id="${exp.id}">
            <td class="col-item">
              <div class="item-title">${exp.item}</div>
              ${exp.supplier ? `<div class="item-supplier">${exp.supplier}</div>` : ''}
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
                  <span>Liquidità netta attuale</span>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(m.currentNetLiquidity)}</strong>
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
                  <div class="statement-subtitle">${mir.subtitle}</div>
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

                <div class="statement-row border-thick">
                  <div class="statement-row-meta">
                    <span>Accumulo mancante (${mir.remainingMonths} mesi)</span>
                    <small class="formula-chip-hint">${mir.monthlySavings}€ × ${mir.remainingMonths}m</small>
                  </div>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(mir.remainingAccumulated)}</strong>
                </div>

                <div class="statement-row statement-row-bold">
                  <span>Totale Lordo Previsto Miriana</span>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(mir.grossProjected)}</strong>
                </div>

                <div class="statement-row">
                  <span>Spese anticipate da Miriana</span>
                  <span class="row-value-negative amount">- ${CurrencyFormatter.format(mir.expensesPaid, { includeSymbol: false })} €</span>
                </div>

                <div class="statement-row">
                  <span>Liquidità netta attuale</span>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(mir.currentNetLiquidity)}</strong>
                </div>
              </div>
            </div>

            <div class="statement-footer-card">
              <div class="statement-footer-title">
                <span>Residuo Netto Finale</span>
              </div>
              <strong class="statement-footer-amount amount">${CurrencyFormatter.format(mir.finalNetResidual)}</strong>
            </div>
          </div>

          <!-- SCHEDA FAMIGLIA & DONI -->
          <div class="statement-card">
            <div>
              <div class="statement-header">
                <div>
                  <div class="statement-title">${fam.title}</div>
                  <div class="statement-subtitle">${fam.subtitle}</div>
                </div>
                <button type="button" class="btn-card-edit" data-card="family" title="Modifica contributi famiglia">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <span>Modifica</span>
                </button>
              </div>
              <div class="statement-divider-solid"></div>

              <div class="statement-rows">
                <div class="statement-row">
                  <span>Stanziamento Amedeo & Anna</span>
                  <div>
                    <button type="button" class="value-box-dashed btn-editable-val" data-card="family" title="Clicca per modificare">
                      ${CurrencyFormatter.format(fam.pledged)}
                    </button>
                  </div>
                </div>

                <div class="statement-row">
                  <span>Anticipo Banchetto (Catering)</span>
                  <div>
                    <button type="button" class="value-box-dashed btn-editable-val text-negative" data-card="family" title="Clicca per modificare">
                      - ${CurrencyFormatter.format(fam.used, { includeSymbol: false })} €
                    </button>
                  </div>
                </div>

                <div class="statement-row">
                  <span>Quota Disponibile Amedeo & Anna</span>
                  <strong class="row-value-amount amount text-settled">${CurrencyFormatter.format(fam.available)}</strong>
                </div>

                <div class="statement-row border-thick">
                  <div class="statement-row-meta">
                    <span>Stima Doni Invitati (100 Ospiti)</span>
                    <small class="formula-chip-hint">100 ospiti × 100€/busta</small>
                  </div>
                  <div>
                    <button type="button" class="value-box-dashed btn-editable-val" data-card="family" title="Clicca per modificare">
                      ${CurrencyFormatter.format(fam.giftsEstimated)}
                    </button>
                  </div>
                </div>

                <div class="statement-row statement-row-bold">
                  <span>Totale Doni & Contributi</span>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(fam.grossProjected)}</strong>
                </div>

                <div class="statement-row">
                  <span>Caparra già utilizzata</span>
                  <span class="row-value-negative amount">- ${CurrencyFormatter.format(fam.used, { includeSymbol: false })} €</span>
                </div>

                <div class="statement-row">
                  <span>Liquidità doni disponibile oggi</span>
                  <strong class="row-value-amount amount">${CurrencyFormatter.format(fam.currentNetLiquidity)}</strong>
                </div>
              </div>
            </div>

            <div class="statement-footer-card">
              <div class="statement-footer-title">
                <span>Totale Doni Disponibili</span>
              </div>
              <strong class="statement-footer-amount amount">${CurrencyFormatter.format(fam.finalNetResidual)}</strong>
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
        const planTotalAvailable = document.getElementById('plan-total-available');
        const planBudgetRequired = document.getElementById('plan-budget-required');
        const planSafetyMargin = document.getElementById('plan-safety-margin');

        if (planTotalAvailable) planTotalAvailable.textContent = CurrencyFormatter.format(coverage.totalFundsAvailable);
        if (planBudgetRequired) planBudgetRequired.textContent = CurrencyFormatter.format(coverage.totalBudgetRequired);
        if (planSafetyMargin) {
          planSafetyMargin.textContent = CurrencyFormatter.format(coverage.serenityMargin);
          planSafetyMargin.style.color = coverage.serenityMargin >= 0 ? 'var(--accent-sage)' : 'var(--accent-terracotta)';
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

    static open(savingsPlan = {}, targetCard = 'all', timeline = null) {
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

      if (elPaidM) elPaidM.textContent = CurrencyFormatter.format(coupleBalance.micheleAmount || 0);
      if (elPctM) elPctM.textContent = `${Math.round(coupleBalance.micheleSharePct || 50)}% delle quote anticipate`;
      if (elPaidMir) elPaidMir.textContent = CurrencyFormatter.format(coupleBalance.mirianaAmount || 0);
      if (elPctMir) elPctMir.textContent = `${Math.round(coupleBalance.mirianaSharePct || 50)}% delle quote anticipate`;

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
    static show(message) {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'toast-note';
      toast.innerHTML = `<span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
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
    ToastView
  };
})();
