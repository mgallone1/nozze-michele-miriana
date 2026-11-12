# Michele & Miriana — Il Nostro Matrimonio

Applicazione privata per la pianificazione e la gestione finanziaria del matrimonio (2 Luglio 2027 • Tenuta Tana di Volpe).

L'interfaccia adotta un'estetica editoriale di alta sartoria ispirata alla cartotecnica d'autore: palette naturale calda (lino, bronzo nobile e salvia), tipografia classica in *Cormorant Garamond* e dettagli tipografici puliti, priva di schemi convenzionali o elementi stereotipati.

---

## Apertura dell'Applicazione

Non richiede installazioni, terminali o server:
1. Apri con doppio clic il file **`index.html`** in questa cartella.
2. L'applicazione si avvia all'istante nel tuo browser abituale (Chrome, Edge, Safari, Firefox).
3. Puoi aggiungerla ai preferiti per consultarla in qualunque momento anche offline.

---

## Sezioni dell'Atelier

### 1. Quadro d'Insieme
- **Conto alla Rovescia:** calcolo continuo dei giorni, delle ore e dei minuti mancanti al 2 Luglio 2027.
- **Investimento Complessivo Stimato:** indicatore d'impatto con barra a scorrimento che separa l'anticipato dal programmato.
- **Quote Anticipate:** bilanciamento tra gli acconti versati da Michele e da Miriana.
- **Le Aree del Matrimonio:** galleria interattiva delle categorie (Location & Banchetto, Abbigliamento, Foto & Video, Musica, Fiori, ecc.). Selezionando una scheda si accede direttamente al dettaglio filtrato.

### 2. Voci & Servizi (Il Registro)
- Elenco completo di tutte le voci e contratti suddivisi per area con i relativi subtotali.
- **Ricerca e Filtri:** ricerca rapida per parola chiave (es. atelier, catering, fotografo, fedi) e filtri per area, stato contrattuale o pagatore.
- **Aggiunta e Modifica:** finestra di dettaglio per inserire nuovi contratti o aggiornare acconti, note e fornitori, con tasti per la ripartizione rapida al 50/50 o individuale.

### 3. Piano di Copertura
- **Riserve Personali:** monitoraggio del piano mensile di Michele (740 €/mese, obiettivo 20.690 €) e di Miriana (400 €/mese, obiettivo 18.500 €).
- **Dono di Famiglia (Anna & Amedeo):** 10.000 € previsti (con 1.500 € già impiegati per l'acconto del catering e 8.500 € disponibili).
- **Doni degli Invitati:** stima di 10.000 € su 100 ospiti.
- **Quadro di Serenità:** confronto tra la disponibilità complessiva stimata e le spese previste, con evidenza del margine di sicurezza a garanzia degli imprevisti.

### 4. Bilancio di Coppia
- Visualizzazione affiancata degli impegni economici sostenuti da Michele e da Miriana.
- Calcolo automatico della compensazione e suggerimenti discreti per i successivi acconti ai fornitori, per mantenere il percorso in piena armonia.

### 5. Archivio & Stampa
- **Salvataggio Istantaneo:** ogni modifica viene registrata in tempo reale nel browser locale.
- **Esporta Riepilogo (.csv):** scarica una copia tabellare dei dati.
- **Salva / Importa Archivio (JSON):** consente di creare copie di sicurezza o trasferire lo stato dell'applicazione su un altro dispositivo.
- **Stampa Fascicolo:** impaginazione dedicata per stampare un documento pulito e formale da portare agli incontri con location e fornitori.

---

## Architettura Software (Clean Architecture)

Il codice sorgente è rigorosamente suddiviso in livelli con responsabilità distinte e unidirezionali:

```text
js/
├── domain/
│   └── entities.js            <- Entità e regole di business pure (Expense, Category, WeddingFinances)
├── services/
│   └── formatters.js          <- Servizi puri (CurrencyFormatter, CountdownService, CsvExporter, BackupService)
├── repositories/
│   └── expense-repository.js  <- Astrazione dell'accesso ai dati e persistenza isolata (LocalStorage)
├── usecases/
│   └── usecases.js            <- Casi d'uso applicativi (GetSummary, Filter, Save, Delete, Backup)
├── ui/
│   └── views.js               <- Viste e componenti visuali semantici (zero stili inline)
├── data.js                    <- Dati di partenza del matrimonio
└── main.js                    <- Composition Root e Controller (avvio ed eventi)
```
