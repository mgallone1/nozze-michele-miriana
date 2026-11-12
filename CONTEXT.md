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
1. **Sincronizzazione Cloud in Tempo Reale (iPhone Miriana & Desktop)**:
   - `js/repositories/expense-repository.js`: confronto dinamico di `updated_at` e contenuto raw per rilevare e applicare istantaneamente modifiche dal cloud senza overhead.
   - `js/main.js`: polling continuo ogni 4 secondi a pagina attiva + auto-sync immediato su ogni risveglio iOS (`pageshow`, `focus`, `visibilitychange` quando si riapre l'iPhone o si sblocca lo schermo).
   - `index.html` & `css/style.css`: badge interattivo con LED animato `Sincronizzato` (`#btn-manual-cloud-sync`) per forzare con un tocco l'aggiornamento manuale con feedback visivo.
2. **Scroll Memory Indipendente tra Schede**:
   - `js/main.js`: memorizzazione della coordinata di scorrimento per singola scheda (`overview`, `expenses`, `savings`, `balance`, `guests`), eliminando salti di scroll tra una vista e l'altra.
3. **Service Worker v16**:
   - `sw.js`: cache version aggiornata a `nozze-mm-v2027-v16` per distribuzione istantanea della nuova versione.

## 4. Azione da eseguire subito dall'Agente:
- Eseguire `git status`, `git add .`, `git commit -m "Sincronizzazione in tempo reale iPhone, pulsante sync e bump SW v16"` e `git push origin main`.
