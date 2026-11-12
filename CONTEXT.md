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
1. **Risolto problema visibilità su iPhone di Miriana**:
   - `js/main.js`: aggiunto auto-sync su risveglio iOS (`pageshow`, `focus`, `visibilitychange`) + polling a 8 secondi.
   - `index.html` & `css/style.css`: aggiunto pulsante interattivo rapido nell'header `🔄 Sincronizzato` (`#btn-manual-cloud-sync`).
   - `sw.js`: cache version aggiornata a `nozze-mm-v2027-v14` per forzare l'aggiornamento automatico su Safari iOS.
2. **Scroll Reset tra Tab**:
   - `js/main.js`: `switchTab` ora esegue `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })` così ogni volta che si cambia scheda si torna in cima alla pagina.

## 4. Azione da eseguire subito dall'Agente:
- Eseguire `git status`, `git add .`, `git commit -m "Auto-sync su risveglio iOS, pulsante sync e scroll reset"` e `git push origin main` per pubblicare online le modifiche.
