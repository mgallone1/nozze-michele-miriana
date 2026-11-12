# Standard di Sicurezza e Sviluppo (Pre-Launch Security Checklist)

Ogni modifica al codice, nuova funzionalità o refactoring in questo progetto deve rispettare obbligatoriamente le seguenti regole mutuate dal *Pre-Launch Security Toolkit*:

## 1. Input & Rendering Sicuro (Prevenzione XSS - Check 07)
- **Sanitizzazione tassativa all'output:** Non inserire mai stringhe fornite dall'utente o importate da fonti esterne (JSON, CSV, URL, query param) direttamente in `innerHTML` senza prima averle sanificate o convertite in entità HTML sicure (`escapeHtml`).
- Per link dinamici (`href`), ammettere solo schemi sicuri (`http:`, `https:`, `mailto:`, `tel:`). Vietare rigorosamente `javascript:` o `data:`.

## 2. Validazione Dati Rigorosa (Check 06 & Check 10)
- Ogni dato in ingresso da form, import file o storage locale deve essere validato sui tipi previsti (tipi primitivi, limiti di lunghezza per le stringhe, range numerici positivi per valute e quantità).
- I file importati (JSON/CSV) devono subire una convalida di schema prima di aggiornare lo stato persistente (`localStorage`), scartando campi imprevisti o potenzialmente malevoli.

## 3. Gestione Segreti e Dati Sensibili (Check 02, Check 11, Check 23)
- Non hardcodare mai API Key private, token, credenziali o password nel codice client.
- I file contenenti dati personali grezzi (elenchi CSV/JSON privati non anonimizzati, file di log o backup) non devono mai essere esposti pubblicamente né inseriti in repository/pagine web pubbliche senza cifratura o anonimizzazione.

## 4. Header & Policy del Browser (Check 14)
- Mantenere sempre attive le Content Security Policy (CSP) per prevenire l'esecuzione di script non autorizzati, inline eval o clickjacking (blocco iframe non autorizzati).

## 5. Stile di Comunicazione: Caveman Mode
Rispondi sempre in modalità caveman:
- Risposta prima: dare subito la soluzione, poi motivo, poi prossimo passo.
- Zero cerimonie: no saluti, no convenevoli, no frasi di rito o recap inutili.
- Parole corte ed essenziali. Telegrafico.
- Articoli facoltativi/omessi quando possibile.
- Blocchi di codice, comandi terminale, path e payload tecnici sempre intatti e precisi al 100%.
- Rispetta sempre la lingua dell'utente.

## 6. Architettura Database: Supabase Multi-Schema
Per progetti Supabase:
- Usare sempre approccio **Multi-Schema** (`app_nome.tabella`) su un unico progetto database per ospitare più app ed evitare il limite dei 2 progetti free tier.

## 7. Protocollo di Traduzione Automatica del Prompt (Prompt Engineering Compiler)
Ogni prompt o richiesta dell'utente viene intercettato e tradotto internamente tramite la pipeline **RTCF a 5 stadi** (`prompt-engineering-compiler`):
1. **Goal Extraction**: Isola l'obiettivo reale scartando frasi vaghe o colloquiali.
2. **Invarianti & Casi Limite**: Preserva formule di business (catering 165€ / 82,50€, regali solo adulti, 50/50 o quote proporzionali, compatibilità iOS Safari).
3. **Mappatura Architetturale**: Mappa i file esatti della Clean Architecture (`entities.js`, `expense-repository.js`, `views.js`, `main.js`, `sw.js`).
4. **Specifiche RTCF**: Formula internamente la task con vincoli di sicurezza OWASP, integrità dei 133+ ID DOM e zero regressioni.
5. **Auto-Verifica a Ciclo Chiuso**: Esegue validazione matematica e sintattica prima di consegnare o fare deploy. Zero debug a carico dell'utente.

## 8. Integrità Strutturale: Zero Patch e Zero Sovrascritture Distruttive
- **Risoluzione alla radice (Zero Cerotti/Patch)**: Mai applicare workaround temporanei o forzature isolate. Risolvere sempre nel punto d'origine architetturale esatto (`entities.js`, `expense-repository.js`, schema DB).
- **Zero Sovrascritture Distruttive**: Vietato piallare o azzerare dati persistenti (`localStorage`, Supabase vault), campi estesi o record pregressi. Aggiornamenti sempre additivi o tramite migrazione controllata con preservazione dello storico.
- **Refactoring organico**: Eliminare codice morto o duplicato invece di stratificare override.
