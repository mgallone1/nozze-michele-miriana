/**
 * APPLICATION COMPOSITION ROOT & CONTROLLER
 * Inizializza l'architettura, collega i casi d'uso alle viste e orchestra gli eventi.
 */

(function () {
  'use strict';

  const {
    LocalStorageExpenseRepository
  } = window.WeddingApp.Repositories;

  const {
    GetWeddingSummaryUseCase,
    FilterExpensesUseCase,
    SaveExpenseUseCase,
    DeleteExpenseUseCase,
    ExportLedgerCsvUseCase,
    BackupVaultUseCase,
    UpdateSavingsPlanUseCase
  } = window.WeddingApp.UseCases;

  const {
    CountdownService,
    DateService,
    SecurityService
  } = window.WeddingApp.Services;

  const {
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
  } = window.WeddingApp.UI;

  // Stato Locale del Presenter / UI State
  const uiState = {
    activeTab: 'overview',
    searchQuery: '',
    filterCategory: 'all',
    filterPayer: 'all',
    filterStatus: 'all',
    editingExpenseId: null,
    simulatedDate: null,
    // Filtri Ospiti
    searchGuestsQuery: '',
    filterGuestsParty: 'all',
    filterGuestsGift: 'all',
    // Posizioni di scorrimento indipendenti per ciascuna tab
    scrollPositions: {
      overview: 0,
      expenses: 0,
      savings: 0,
      balance: 0,
      guests: 0
    }
  };

  // Istanze Architetturali
  const repository = new LocalStorageExpenseRepository(INITIAL_WEDDING_DATA);
  const getSummaryUseCase = new GetWeddingSummaryUseCase(repository);
  const saveExpenseUseCase = new SaveExpenseUseCase(repository);
  const deleteExpenseUseCase = new DeleteExpenseUseCase(repository);
  const exportCsvUseCase = new ExportLedgerCsvUseCase(repository);
  const backupVaultUseCase = new BackupVaultUseCase(repository);
  const updateSavingsPlanUseCase = new UpdateSavingsPlanUseCase(repository);
  const saveGuestUseCase = new window.WeddingApp.UseCases.SaveGuestUseCase(repository);
  const deleteGuestUseCase = new window.WeddingApp.UseCases.DeleteGuestUseCase(repository);

  // Ciclo Unidirezionale di Aggiornamento
  function refreshAll() {
    const summary = getSummaryUseCase.execute({ referenceDate: uiState.simulatedDate });
    const data = repository.load();

    // 0. Aggiorna Pannello Timeline Interattiva (Evoluzione Temporale)
    TimelineView.render(summary.finances.timeline, {
      onTimeChange: (elapsedMonths) => {
        const planStartDate = data.savingsPlan?.parameters?.startDate || '2025-10-10';
        uiState.simulatedDate = DateService.getDateFromElapsedMonths(planStartDate, elapsedMonths);
        refreshAll();
      },
      onResetToday: () => {
        uiState.simulatedDate = null;
        refreshAll();
        ToastView.show('Proiezione riallineata alla data odierna');
      }
    });

    // 1. Aggiorna Eroe Finanziario
    FinancialHeroView.render(summary.finances);

    // 2. Aggiorna Galleria delle Categorie
    CategoryGalleryView.render(summary.finances.categoryAggregates, (categoryId) => {
      uiState.filterCategory = categoryId;
      const selectEl = document.getElementById('filter-category');
      if (selectEl) selectEl.value = categoryId;
      refreshAll();
      switchTab('expenses');
    });

    // 3. Filtra e Aggiorna Tabella Registro
    const filteredExpenses = FilterExpensesUseCase.execute(data.expenses, data.categories, {
      query: uiState.searchQuery,
      categoryId: uiState.filterCategory,
      payer: uiState.filterPayer,
      status: uiState.filterStatus
    });

    LedgerTableView.render(filteredExpenses, data.categories, {
      onEdit: (id) => openExpenseModal(id),
      onDelete: (id) => handleDeleteExpense(id)
    });

    // 4. Aggiorna Piano di Copertura
    SavingsPlanView.render({
      statements: summary.finances.statements,
      coverage: summary.finances.coverage,
      timeline: summary.finances.timeline
    }, {
      onEdit: (cardKey) => openSavingsPlanModal(cardKey)
    });

    // 5. Aggiorna Bilancio di Coppia
    CoupleBalanceView.render({
      coupleBalance: summary.finances.coupleBalance,
      expenses: data.expenses
    });

    // 6. Aggiorna Ospiti & Doni
    renderGuestsList(data.guests || [], summary.finances);

    // 7. Aggiorna Countdown e Dettagli Intestazione
    updateCountdownTick(summary.details, summary.finances.timeline.currentDate);
  }

  function renderGuestsList(guests = [], finances = null) {
    const q = (uiState.searchGuestsQuery || '').toLowerCase().trim();
    const party = uiState.filterGuestsParty;
    const giftStatus = uiState.filterGuestsGift;

    const filtered = guests.filter(g => {
      if (q) {
        const matchName = (g.name || '').toLowerCase().includes(q);
        const matchNotes = (g.notes || '').toLowerCase().includes(q);
        if (!matchName && !matchNotes) return false;
      }
      if (party !== 'all' && g.party !== party) return false;
      if (giftStatus === 'received' && !g.isGiftReceived) return false;
      if (giftStatus === 'pending' && g.isGiftReceived) return false;
      return true;
    });

    GuestsView.render({ guests: filtered, finances }, {
      onEdit: (id) => {
        const guest = guests.find(g => g.id === id);
        if (guest) GuestModalView.open(guest);
      },
      onDelete: (id) => {
        const guest = guests.find(g => g.id === id);
        if (!guest) return;
        if (window.confirm(`Desideri rimuovere l'invitato "${guest.name}"?`)) {
          const removedGuest = { ...guest };
          deleteGuestUseCase.execute(id);
          refreshAll();
          ToastView.show(`Invitato "${removedGuest.name}" rimosso`, {
            undoText: 'Annulla',
            duration: 6000,
            onUndo: () => {
              saveGuestUseCase.execute(removedGuest);
              refreshAll();
              ToastView.show(`Invitato "${removedGuest.name}" ripristinato`);
            }
          });
        }
      },
      onToggleGift: (id) => {
        const guest = guests.find(g => g.id === id);
        if (!guest) return;
        guest.isGiftReceived = !guest.isGiftReceived;
        saveGuestUseCase.execute(guest);
        refreshAll();
        ToastView.show(guest.isGiftReceived ? `Regalo di "${guest.name}" segnato come ricevuto` : `Regalo di "${guest.name}" segnato come in sospeso`);
      }
    });
  }

  function updateCountdownTick(details, referenceDate = null) {
    if (!details?.date) return;
    const result = CountdownService.calculate(details.date, details.time || '17:00', referenceDate);
    HeaderView.updateCountdown(result, details);
  }

  // Gestione Tab con Scroll Memory indipendente per ciascuna vista
  function switchTab(targetTab) {
    const currentTab = uiState.activeTab;

    // 1. Memorizza la posizione di scorrimento della scheda corrente
    if (currentTab && uiState.scrollPositions) {
      uiState.scrollPositions[currentTab] = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    uiState.activeTab = targetTab;
    const tabs = document.querySelectorAll('.nav-link-btn');
    const sections = {
      overview: document.getElementById('view-overview'),
      expenses: document.getElementById('view-expenses'),
      savings: document.getElementById('view-savings'),
      balance: document.getElementById('view-balance'),
      guests: document.getElementById('view-guests')
    };

    tabs.forEach(tab => {
      if (tab.dataset.tab === targetTab) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    Object.keys(sections).forEach(key => {
      if (sections[key]) {
        if (key === targetTab) {
          sections[key].classList.remove('is-hidden');
          sections[key].style.display = 'block';
        } else {
          sections[key].classList.add('is-hidden');
          sections[key].style.display = 'none';
        }
      }
    });

    // 2. Ripristina la posizione esatta della nuova scheda (o cima se mai visitata)
    const savedY = (uiState.scrollPositions && uiState.scrollPositions[targetTab] !== undefined)
      ? uiState.scrollPositions[targetTab]
      : 0;

    // RequestAnimationFrame garantisce il ripristino dopo il reflow del DOM
    requestAnimationFrame(() => {
      window.scrollTo({
        top: savedY,
        left: 0,
        behavior: 'instant'
      });
    });
  }

  // Modale Inserimento & Modifica
  function openExpenseModal(expenseId = null) {
    const modal = document.getElementById('expense-modal');
    const form = document.getElementById('expense-form');
    const title = document.getElementById('modal-title');
    if (!modal || !form) return;

    uiState.editingExpenseId = expenseId;
    const data = repository.load();

    if (expenseId) {
      const exp = data.expenses.find(e => e.id === expenseId);
      if (!exp) return;

      title.textContent = 'Modifica Voce';
      document.getElementById('expense-item').value = exp.item || '';
      document.getElementById('expense-category').value = exp.categoryId || (data.categories[0]?.id || '');
      
      const isCatering = (exp.id === 'exp_2' || (exp.categoryId === 'location_catering' && (exp.item || '').toLowerCase().includes('catering')));
      const netInput = document.getElementById('expense-net-amount');
      const bInput = document.getElementById('expense-budget');
      const chkVat = document.getElementById('expense-has-vat');
      const pnlVat = document.getElementById('expense-vat-panel');

      // Se è catering, l'imponibile è il prezzo a persona (default 150), altrimenti il costo imponibile registrato
      let baseNet = isCatering ? (exp.unitPriceNet || 150) : (exp.netAmount !== null ? exp.netAmount : exp.budget);
      if (netInput) netInput.value = baseNet;
      if (bInput) bInput.value = exp.budget ?? 0;

      if (chkVat) {
        chkVat.checked = (exp.hasVat !== false); // True di default o se salvato true
      }
      const rateToSet = exp.vatRate || (isCatering ? 10 : 22);
      const radioRate = document.querySelector(`input[name="vat-rate"][value="${rateToSet}"]`);
      if (radioRate) radioRate.checked = true;

      document.getElementById('expense-paid-michele').value = exp.paidMichele ?? 0;
      document.getElementById('expense-paid-miriana').value = exp.paidMiriana ?? 0;
      const famMInput = document.getElementById('expense-paid-family-michele');
      if (famMInput) famMInput.value = exp.paidFamilyMichele ?? 0;
      const famMirInput = document.getElementById('expense-paid-family-miriana');
      if (famMirInput) famMirInput.value = exp.paidFamilyMiriana ?? 0;
      document.getElementById('expense-supplier').value = exp.supplier || '';
      document.getElementById('expense-notes').value = exp.notes || '';
      document.getElementById('expense-status').value = exp.status || 'pianificato';
      document.getElementById('expense-split-type').value = exp.splitType || 'equal';
      const estimateSelect = document.getElementById('expense-is-estimate');
      if (estimateSelect) {
        estimateSelect.value = exp.isEstimate ? 'true' : 'false';
      }
      const staffInput = document.getElementById('expense-staff-count');
      if (staffInput) {
        staffInput.value = exp.staffCount ?? 0;
      }

      recalculateVatEquation();
    } else {
      title.textContent = 'Nuova Voce';
      form.reset();
      const netInput = document.getElementById('expense-net-amount');
      const bInput = document.getElementById('expense-budget');
      const chkVat = document.getElementById('expense-has-vat');
      if (netInput) netInput.value = '';
      if (bInput) bInput.value = 0;
      if (chkVat) chkVat.checked = true;
      const radioRate = document.querySelector(`input[name="vat-rate"][value="22"]`);
      if (radioRate) radioRate.checked = true;
      const famMInput = document.getElementById('expense-paid-family-michele');
      if (famMInput) famMInput.value = 0;
      const famMirInput = document.getElementById('expense-paid-family-miriana');
      if (famMirInput) famMirInput.value = 0;
      document.getElementById('expense-status').value = 'pianificato';
      document.getElementById('expense-split-type').value = 'equal';
      const estimateSelect = document.getElementById('expense-is-estimate');
      if (estimateSelect) {
        estimateSelect.value = 'true';
      }
      const staffInput = document.getElementById('expense-staff-count');
      if (staffInput) {
        staffInput.value = 0;
      }
      if (data.categories.length > 0) {
        document.getElementById('expense-category').value = data.categories[0].id;
      }
      recalculateVatEquation();
    }

    modal.classList.add('open');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = document.getElementById('expense-item');
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
    }
  }

  function closeExpenseModal() {
    const modal = document.getElementById('expense-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.classList.remove('active');
    }
    document.body.style.overflow = '';
    uiState.editingExpenseId = null;
  }

  function handleSaveForm(e) {
    e.preventDefault();

    const item = document.getElementById('expense-item').value.trim();
    const categoryId = document.getElementById('expense-category').value;
    const budget = parseFloat(document.getElementById('expense-budget').value) || 0;
    const paidMichele = parseFloat(document.getElementById('expense-paid-michele').value) || 0;
    const paidMiriana = parseFloat(document.getElementById('expense-paid-miriana').value) || 0;
    const paidFamilyMichele = parseFloat(document.getElementById('expense-paid-family-michele')?.value) || 0;
    const paidFamilyMiriana = parseFloat(document.getElementById('expense-paid-family-miriana')?.value) || 0;
    const supplier = document.getElementById('expense-supplier').value.trim();
    const notes = document.getElementById('expense-notes').value.trim();
    const status = document.getElementById('expense-status').value;
    const splitType = document.getElementById('expense-split-type').value || 'equal';
    const isEstimate = document.getElementById('expense-is-estimate')?.value === 'true';
    const staffCount = parseInt(document.getElementById('expense-staff-count')?.value, 10) || 0;

    const hasVat = document.getElementById('expense-has-vat')?.checked || false;
    const netAmount = parseFloat(document.getElementById('expense-net-amount')?.value) || 0;
    let vatRate = 10;
    const checkedRadio = document.querySelector('input[name="vat-rate"]:checked');
    if (checkedRadio) vatRate = parseFloat(checkedRadio.value) || 10;

    const isCatering = (uiState.editingExpenseId === 'exp_2') || categoryId === 'location_catering' || item.toLowerCase().includes('catering');

    const payload = {
      id: uiState.editingExpenseId,
      item,
      categoryId,
      budget,
      paidMichele,
      paidMiriana,
      paidFamilyMichele,
      paidFamilyMiriana,
      supplier,
      notes,
      status,
      splitType,
      isEstimate,
      staffCount,
      hasVat,
      vatRate,
      netAmount: isCatering ? null : netAmount,
      unitPriceNet: isCatering ? netAmount : null
    };

    const result = saveExpenseUseCase.execute(payload);
    if (!result.success) {
      ToastView.show(result.errors.join(' '));
      return;
    }

    closeExpenseModal();
    ToastView.show(`Voce "${item}" salvata con successo`);
    refreshAll();
  }

  function handleDeleteExpense(id) {
    const data = repository.load();
    const exp = data.expenses.find(e => e.id === id);
    if (!exp) return;

    const confirmed = window.confirm(`Desideri eliminare la voce "${exp.item}"?`);
    if (!confirmed) return;

    // Salviamo una copia completa per consentire l'annulla
    const deletedExp = { ...exp };

    deleteExpenseUseCase.execute(id);
    refreshAll();

    ToastView.show(`Voce "${deletedExp.item}" eliminata`, {
      undoText: 'Annulla',
      duration: 6000,
      onUndo: () => {
        saveExpenseUseCase.execute(deletedExp);
        refreshAll();
        ToastView.show(`Voce "${deletedExp.item}" ripristinata con successo`);
      }
    });
  }

  // Ricalcola e formatta il resoconto trasparente dell'IVA (es: 150 + 15 = 165 €)
  function recalculateVatEquation() {
    const chkVat = document.getElementById('expense-has-vat');
    const netInput = document.getElementById('expense-net-amount');
    const bInput = document.getElementById('expense-budget');
    const pnlVat = document.getElementById('expense-vat-panel');
    const formulaText = document.getElementById('vat-formula-text');
    const summaryVal = document.getElementById('budget-summary-val');
    const summaryLbl = document.getElementById('budget-summary-label');
    const catSelect = document.getElementById('expense-category');
    const itemInput = document.getElementById('expense-item');
    const lblAmount = document.getElementById('lbl-expense-amount');

    if (!chkVat || !netInput || !bInput) return;

    const cat = catSelect ? catSelect.value : '';
    const itemName = (itemInput ? itemInput.value : '').toLowerCase();
    const isCatering = (uiState.editingExpenseId === 'exp_2') || cat === 'location_catering' || itemName.includes('catering');

    if (lblAmount) {
      lblAmount.textContent = isCatering ? 'Prezzo a Persona Netto (IVA Esclusa) (€)' : 'Prezzo Netto (IVA Esclusa) (€)';
    }

    const netVal = parseFloat(netInput.value) || 0;
    const hasVat = chkVat.checked;

    let rate = 10;
    const checkedRadio = document.querySelector('input[name="vat-rate"]:checked');
    if (checkedRadio) rate = parseFloat(checkedRadio.value) || 10;

    let unitWithVat = netVal;
    let vatPart = 0;

    if (hasVat) {
      if (pnlVat) pnlVat.style.display = 'flex';
      vatPart = Math.round((netVal * (rate / 100)) * 100) / 100;
      unitWithVat = Math.round((netVal + vatPart) * 100) / 100;
      if (formulaText) {
        formulaText.innerHTML = `<strong>${netVal.toLocaleString('it-IT')} €</strong> + <strong>${vatPart.toLocaleString('it-IT')} €</strong> (IVA ${rate}%) = <strong class="text-settled">${unitWithVat.toLocaleString('it-IT')} €</strong>`;
      }
    } else {
      if (pnlVat) pnlVat.style.display = 'none';
      if (formulaText) {
        formulaText.textContent = `${netVal.toLocaleString('it-IT')} € (senza IVA)`;
      }
    }

    // Se è catering, calcola il budget totale moltiplicando per il numero effettivo di ospiti e staff
    let totalBudgetCalculated = unitWithVat;
    if (isCatering) {
      const summary = getSummaryUseCase.execute({ referenceDate: uiState.simulatedDate });
      const guestStats = summary?.finances?.coupleBalance?.guestStats;
      const adultCount = guestStats?.adultGuestsCount || 101;
      const childCount = guestStats?.childGuestsCount || 11;
      const staffCount = parseInt(document.getElementById('expense-staff-count')?.value, 10) || 0;
      const halfPrice = Math.round((unitWithVat / 2) * 100) / 100;

      totalBudgetCalculated = Math.round(unitWithVat * adultCount + halfPrice * childCount + halfPrice * staffCount);
      if (summaryLbl) {
        summaryLbl.textContent = `Totale Banchetto (${adultCount} adulti + ${childCount} bimbi + ${staffCount} staff):`;
      }
    } else {
      if (summaryLbl) summaryLbl.textContent = 'Budget Complessivo della Spesa:';
    }

    bInput.value = totalBudgetCalculated;
    if (summaryVal) {
      summaryVal.textContent = `${totalBudgetCalculated.toLocaleString('it-IT')} €`;
    }
  }

  // Setup Calcolatore IVA Dinamica per Budget Spesa
  function setupVatCalculator() {
    const chkVat = document.getElementById('expense-has-vat');
    const netInput = document.getElementById('expense-net-amount');
    const catSelect = document.getElementById('expense-category');
    const itemInput = document.getElementById('expense-item');
    const staffInput = document.getElementById('expense-staff-count');

    if (chkVat) {
      chkVat.addEventListener('change', () => recalculateVatEquation());
    }

    if (netInput) {
      netInput.addEventListener('input', () => recalculateVatEquation());
    }

    if (staffInput) {
      staffInput.addEventListener('input', () => recalculateVatEquation());
    }

    if (catSelect) {
      catSelect.addEventListener('change', () => {
        const cat = catSelect.value;
        const radio = document.querySelector(`input[name="vat-rate"][value="${cat === 'location_catering' ? '10' : '22'}"]`);
        if (radio) radio.checked = true;
        recalculateVatEquation();
      });
    }

    if (itemInput) {
      itemInput.addEventListener('input', () => {
        const text = itemInput.value.toLowerCase();
        if (text.includes('catering') || text.includes('banchetto')) {
          const radio = document.querySelector('input[name="vat-rate"][value="10"]');
          if (radio) radio.checked = true;
        }
        recalculateVatEquation();
      });
    }

    document.querySelectorAll('input[name="vat-rate"]').forEach(r => {
      r.addEventListener('change', () => recalculateVatEquation());
    });
  }

  // Scorciatoie di Ripartizione nel Modale
  function setupSplitShortcuts() {
    const bInput = document.getElementById('expense-budget');
    const mInput = document.getElementById('expense-paid-michele');
    const mirInput = document.getElementById('expense-paid-miriana');

    const btn5050 = document.getElementById('split-5050');
    const btnAllM = document.getElementById('split-all-michele');
    const btnAllMir = document.getElementById('split-all-miriana');
    const btnReset = document.getElementById('split-reset');

    if (btn5050) {
      btn5050.addEventListener('click', () => {
        const val = parseFloat(bInput.value) || 0;
        const half = Math.round((val / 2) * 100) / 100;
        mInput.value = half;
        mirInput.value = val - half;
      });
    }

    if (btnAllM) {
      btnAllM.addEventListener('click', () => {
        const val = parseFloat(bInput.value) || 0;
        mInput.value = val;
        mirInput.value = 0;
      });
    }

    if (btnAllMir) {
      btnAllMir.addEventListener('click', () => {
        const val = parseFloat(bInput.value) || 0;
        mInput.value = 0;
        mirInput.value = val;
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        mInput.value = 0;
        mirInput.value = 0;
        const famM = document.getElementById('expense-paid-family-michele');
        if (famM) famM.value = 0;
        const famMir = document.getElementById('expense-paid-family-miriana');
        if (famMir) famMir.value = 0;
      });
    }
  }

  // Popolamento selettori categorie
  function populateCategoryDropdowns() {
    const data = repository.load();
    const filterCat = document.getElementById('filter-category');
    const modalCat = document.getElementById('expense-category');

    if (filterCat) {
      filterCat.innerHTML = `<option value="all">Tutte le Aree (${data.categories.length})</option>` +
        data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    if (modalCat) {
      modalCat.innerHTML = data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
  }

  // Modale Piano di Copertura
  function openSavingsPlanModal(targetCard = 'all') {
    const data = repository.load();
    const summary = getSummaryUseCase.execute({ referenceDate: uiState.simulatedDate });
    SavingsPlanModalView.open(data.savingsPlan, targetCard, summary.finances?.timeline, summary.details, summary.finances);
  }

  // Inizializzazione Eventi
  function bindEvents() {
    // Gestione Modale Piano di Copertura
    SavingsPlanModalView.init({
      onSave: (updatedPlan) => {
        updateSavingsPlanUseCase.execute(updatedPlan);
        refreshAll();
        ToastView.show('Parametri di copertura aggiornati con successo');
      }
    });

    const btnOpenSavings = document.getElementById('btn-open-savings-modal');
    if (btnOpenSavings) {
      btnOpenSavings.addEventListener('click', () => openSavingsPlanModal('all'));
    }

    // Gestione Modale Ospiti
    GuestModalView.init({
      onSave: (guestInput) => {
        const res = saveGuestUseCase.execute(guestInput);
        if (!res.success) {
          ToastView.show(res.errors.join(' '));
          return;
        }
        refreshAll();
        ToastView.show(`Invitato "${guestInput.name}" salvato`);
      }
    });

    const btnAddGuest = document.getElementById('btn-add-guest');
    if (btnAddGuest) {
      btnAddGuest.addEventListener('click', () => GuestModalView.open());
    }

    // Filtri e Ricerca Ospiti
    const searchGuestsInput = document.getElementById('search-guests');
    if (searchGuestsInput) {
      searchGuestsInput.addEventListener('input', (e) => {
        uiState.searchGuestsQuery = e.target.value;
        refreshAll();
      });
    }

    const filterGuestsParty = document.getElementById('filter-guests-party');
    if (filterGuestsParty) {
      filterGuestsParty.addEventListener('change', (e) => {
        uiState.filterGuestsParty = e.target.value;
        refreshAll();
      });
    }

    const filterGuestsGift = document.getElementById('filter-guests-gift');
    if (filterGuestsGift) {
      filterGuestsGift.addEventListener('change', (e) => {
        uiState.filterGuestsGift = e.target.value;
        refreshAll();
      });
    }

    // Navigazione Tab
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Filtri e Ricerca
    const searchInput = document.getElementById('search-expenses');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        uiState.searchQuery = e.target.value;
        refreshAll();
      });
    }

    const filterCat = document.getElementById('filter-category');
    if (filterCat) {
      filterCat.addEventListener('change', (e) => {
        uiState.filterCategory = e.target.value;
        refreshAll();
      });
    }

    const filterPayer = document.getElementById('filter-payer');
    if (filterPayer) {
      filterPayer.addEventListener('change', (e) => {
        uiState.filterPayer = e.target.value;
        refreshAll();
      });
    }

    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
      filterStatus.addEventListener('change', (e) => {
        uiState.filterStatus = e.target.value;
        refreshAll();
      });
    }

    // Modale
    const newBtn = document.getElementById('btn-new-expense');
    if (newBtn) newBtn.addEventListener('click', () => openExpenseModal(null));

    const newBtnTable = document.getElementById('btn-new-expense-table');
    if (newBtnTable) newBtnTable.addEventListener('click', () => openExpenseModal(null));

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeExpenseModal);

    const cancelBtn = document.getElementById('modal-cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', closeExpenseModal);

    const modalBackdrop = document.getElementById('expense-modal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeExpenseModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeExpenseModal();
    });

    const form = document.getElementById('expense-form');
    if (form) form.addEventListener('submit', handleSaveForm);

    setupSplitShortcuts();
    setupVatCalculator();

    // Export & Backup
    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        exportCsvUseCase.execute();
        ToastView.show('Documento di riepilogo scaricato');
      });
    }

    const btnExportJson = document.getElementById('btn-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        backupVaultUseCase.exportBackup();
        ToastView.show('Archivio di sicurezza scaricato');
      });
    }

    const fileInput = document.getElementById('file-import-json');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const res = backupVaultUseCase.importBackup(evt.target.result);
            if (res.success) {
              populateCategoryDropdowns();
              refreshAll();
              ToastView.show('Archivio ripristinato con successo');
            } else {
              ToastView.show('File archivio non valido');
            }
          };
          reader.readAsText(e.target.files[0]);
          e.target.value = '';
        }
      });
    }

    const btnReset = document.getElementById('btn-reset-data');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const ok = window.confirm('Desideri ripristinare i dati di partenza del matrimonio? Eventuali modifiche recenti andranno perse.');
        if (ok) {
          backupVaultUseCase.reset();
          populateCategoryDropdowns();
          refreshAll();
          ToastView.show('Dati di partenza ripristinati');
        }
      });
    }

    // Stampa Fascicolo
    const btnPrint = document.getElementById('btn-print');
    if (btnPrint) btnPrint.addEventListener('click', () => window.print());

    // Modifica Codice PIN di Sicurezza
    const btnChangePin = document.getElementById('btn-change-pin');
    if (btnChangePin) {
      btnChangePin.addEventListener('click', async () => {
        const newPin = window.prompt('Inserisci il nuovo codice PIN di sicurezza a 6 cifre (es. 020727):');
        if (!newPin) return;
        const clean = newPin.trim();
        if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
          window.alert('Il PIN deve essere composto esattamente da 6 cifre numeriche (es. 020727).');
          return;
        }
        try {
          await SecurityService.changePin(clean);
          ToastView.show('Codice PIN di sicurezza a 6 cifre aggiornato con successo');
        } catch (err) {
          window.alert(err.message || 'Errore durante l\'aggiornamento del PIN.');
        }
      });
    }

    setupSplitShortcuts();
    setupPinGate();
  }

  // Cortina di Sicurezza e Tastierino PIN (6 Cifre) & Face ID
  function setupPinGate() {
    const overlay = document.getElementById('pin-gate-overlay');
    if (!overlay) return;

    if (SecurityService.isAuthenticated()) {
      overlay.classList.add('is-hidden');
      return;
    }

    overlay.classList.remove('is-hidden');
    let currentInput = '';
    const dots = document.querySelectorAll('.pin-dot');
    const errorFeedback = document.getElementById('pin-error-feedback');
    const biometricsBtn = document.getElementById('btn-biometrics-trigger');
    const biometricsContainer = document.getElementById('pin-biometrics-container');

    // Controllo disponibilità Face ID / Touch ID (WebAuthn)
    SecurityService.isBiometricsAvailable().then(available => {
      if (!available && biometricsContainer) {
        biometricsContainer.style.display = 'none';
      }
    });

    if (biometricsBtn) {
      biometricsBtn.addEventListener('click', async () => {
        try {
          const authOk = await SecurityService.verifyBiometrics();
          if (authOk) {
            if (errorFeedback) errorFeedback.classList.add('is-hidden');
            overlay.classList.add('is-hidden');
            ToastView.show('Accesso autorizzato tramite Face ID');
          }
        } catch (err) {
          console.warn('Verifica Face ID non completata:', err);
          if (errorFeedback) {
            errorFeedback.textContent = 'Autenticazione Face ID annullata o non riconosciuta. Usa il PIN.';
            errorFeedback.classList.remove('is-hidden');
          }
        }
      });
    }

    function updateDots() {
      dots.forEach((dot, idx) => {
        if (idx < currentInput.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      });
    }

    async function checkPin() {
      if (currentInput.length !== 6) return;
      const res = await SecurityService.verify(currentInput);
      if (res && res.success) {
        if (errorFeedback) errorFeedback.classList.add('is-hidden');
        overlay.classList.add('is-hidden');
        ToastView.show('Benvenuto nell\'Atelier M&M');
      } else {
        if (errorFeedback) {
          if (res && res.locked) {
            errorFeedback.textContent = `Troppi tentativi errati. Accesso bloccato per ${res.remainingMinutes} minuti.`;
          } else {
            const left = res ? res.attemptsLeft : 0;
            errorFeedback.textContent = `Codice non corretto. ${left > 0 ? `Tentativi rimasti: ${left}` : 'Riprova.'}`;
          }
          errorFeedback.classList.remove('is-hidden');
        }
        currentInput = '';
        updateDots();
      }
    }

    document.querySelectorAll('.pin-key[data-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lockCheck = SecurityService.isLocked();
        if (lockCheck.locked) {
          if (errorFeedback) {
            errorFeedback.textContent = `Accesso temporaneamente bloccato per sicurezza (${lockCheck.remainingMinutes} min).`;
            errorFeedback.classList.remove('is-hidden');
          }
          return;
        }

        if (currentInput.length >= 6) return;
        currentInput += btn.dataset.key;
        updateDots();
        if (errorFeedback) errorFeedback.classList.add('is-hidden');
        if (currentInput.length === 6) {
          setTimeout(checkPin, 100);
        }
      });
    });

    const btnClear = document.getElementById('btn-pin-clear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        currentInput = '';
        updateDots();
        if (errorFeedback) errorFeedback.classList.add('is-hidden');
      });
    }

    const btnBack = document.getElementById('btn-pin-back');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          updateDots();
        }
      });
    }
  }

  // Registrazione Service Worker per iPhone & Offline PWA con auto-aggiornamento
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          if (reg) {
            // Controlla aggiornamenti all'avvio
            reg.update();

            // Rileva quando c'è un nuovo service worker pronto
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('Nuova versione rilevata, ricaricamento automatico...');
                    window.location.reload();
                  }
                });
              }
            });
          }
        }).catch((err) => {
          console.warn('ServiceWorker non registrato:', err);
        });

        // Quando torni sull'app da background/multitasking su iPhone
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            navigator.serviceWorker.getRegistration().then((reg) => {
              if (reg) reg.update();
            });
          }
        });
      });
    }
  }

  // Aggiornamento visivo dello stato di sincronizzazione Cloud
  function setSyncStatus(status, text) {
    const dot = document.getElementById('sync-status-dot');
    const label = document.getElementById('sync-status-text');
    if (dot) {
      dot.className = 'sync-dot ' + status; // 'synced', 'syncing', 'error'
    }
    if (label) {
      label.textContent = text;
    }
  }

  // Sincronizzazione Cloud in background senza flicker
  let isSyncing = false;
  async function triggerCloudSync(isManualClick = false) {
    if (isSyncing) return;
    isSyncing = true;
    
    // Aggiorna lo stato testuale solo se l'utente ha toccato manualmente il bottone
    if (isManualClick) {
      setSyncStatus('syncing', 'Sincronizzazione...');
    }

    try {
      const res = await repository.syncFromCloud();
      if (res && res.success) {
        if (res.updated) {
          populateCategoryDropdowns();
          refreshAll();
          if (isManualClick) {
            ToastView.show('Dati aggiornati in tempo reale con il Cloud');
          }
        } else if (isManualClick) {
          ToastView.show('Dati già allineati al Cloud');
        }
        setSyncStatus('synced', 'Sincronizzato');
      } else {
        // Rete momentaneamente non disponibile o modalità offline
        if (isManualClick) {
          const detail = res && res.error ? ` (${res.error})` : '';
          ToastView.show(`Cloud momentaneamente non raggiungibile${detail}. Usando dati salvati.`);
        }
        setSyncStatus('error', 'Offline');
      }
    } catch (e) {
      console.warn('Errore sincronizzazione cloud:', e);
      setSyncStatus('error', 'Offline');
    } finally {
      isSyncing = false;
    }
  }

  // Sincronizzazione Cloud Automatica iniziale
  async function initCloudSync() {
    await triggerCloudSync(false);
  }

  // Bootstrap dell'Applicazione
  document.addEventListener('DOMContentLoaded', async () => {
    registerServiceWorker();

    // 1. Rendering immediato dai dati locali per non bloccare l'interfaccia né il countdown
    populateCategoryDropdowns();
    bindEvents();
    refreshAll();

    // 2. Tasto manuale di sincronizzazione nell'header
    const btnManualSync = document.getElementById('btn-manual-cloud-sync');
    if (btnManualSync) {
      btnManualSync.addEventListener('click', () => {
        triggerCloudSync(true);
      });
    }

    // 3. Sincronizzazione asincrona con Cloud in background
    await initCloudSync();

    // 4. Polling intelligente ogni 20 secondi in background quando la scheda è attiva
    setInterval(() => {
      if (!document.hidden && navigator.onLine) {
        triggerCloudSync(false);
      }
    }, 20000);

    // 5. Risveglio immediato su iPhone (Safari / PWA Standalone)
    // Intercetta ritorno da lock-screen, cambio app o passaggio a scheda attiva
    const onWakeup = () => {
      triggerCloudSync(false);
    };

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) onWakeup();
    });
    window.addEventListener('pageshow', onWakeup);
    window.addEventListener('focus', onWakeup);

    // 6. Timer Countdown al minuto
    setInterval(() => {
      const summary = getSummaryUseCase.execute({ referenceDate: uiState.simulatedDate });
      updateCountdownTick(summary.details, summary.finances?.timeline?.currentDate);
    }, 60000);
  });

})();
