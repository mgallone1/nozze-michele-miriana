# PROGETTO ATELIER NOZZE MICHELE & MIRIANA — CONTESTO DI SVILUPPO

## 1. Posizione del Progetto su Linux
- Cartella di lavoro: `/home/michele/nozze-michele-miriana`
- Repository GitHub: `https://github.com/mgallone1/nozze-michele-miriana.git` (branch `main`)
- Database Cloud: Supabase REST Vault (`rpccqbydibkmkpmrlxgv.supabase.co`, ID: `matrimonio_mm_vault_master`)

## 2. Dati Chiave di Business (Invarianti)
- Data Matrimonio: 2 Luglio 2027 a Tenuta Tana di Volpe.
- Totale Ospiti: 112 Ospiti (38 nuclei familiari, 101 adulti e 11 bambini).
- Banchetto Catering: 165 € ad adulto, 82,50 € a bambino (50%) e 82,50 € a membro dello staff/fornitore (50%). Totale catering: 17.573 €.
- Doni stimati: 10.100 € (calcolati su 101 adulti a 100 €/adulto, bambini esclusi dai doni).
- Budget complessivo: 46.673 €.

## 3. Ultime Modifiche Applicate (Pronte per il Commit/Push)
1. **Gestione Doni & Acconti Famiglie Esterne (Abiti Sposi / Regali Genitori)**:
   - `js/domain/entities.js`: estesa entità `Expense` con `paidFamilyMichele` e `paidFamilyMiriana`. `calculateOwed` sconta i doni esterni prima di ripartire la spesa, così il fornitore risulta saldato/anticipato senza alterare la quota mensile o la liquidità personale degli sposi.
   - `index.html` & `css/style.css`: aggiunto box dedicato nel modale spese *"🎁 Dono / Pagato dalle Famiglie (Non tocca i risparmi personali)"* con campi distinti per Famiglia Michele e Famiglia Miriana.
   - `js/ui/views.js`: badge personalizzati `Fam. Michele` e `Fam. Miriana` nella tabella mastro e pannello dedicato nel "Bilancio di Coppia" per riepilogare tutti i doni esterni versati ai fornitori.
   - `js/repositories/expense-repository.js`: persistenza e sincronizzazione Supabase di `paidFamilyMichele` e `paidFamilyMiriana`.
2. **Filtro Fornitori / Spese**:
   - `js/usecases/usecases.js` & `index.html`: aggiunto filtro rapido `Dono/Famiglie` tra i contribuenti del registro spese.
3. **Service Worker v17**:
   - `sw.js`: bump a `nozze-mm-v2027-v17` per forzare l'aggiornamento immediato su iPhone e desktop.

## 4. Azione da eseguire subito dall'Agente:
- Eseguire `git status`, `git add .`, `git commit -m "Gestione doni e acconti vestiti da famiglie senza toccare risparmi personali e bump SW v17"` e `git push origin main`.
