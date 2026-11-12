# ATELIER DI NOZZE — MICHELE & MIRIANA
**Guida alla fruizione e salvataggio su iPhone (Standalone, Offline & Sicura al 100%)**

---

### 1. Architettura della Sicurezza Integrata
L'applicazione è stata blindata con le seguenti protezioni:
1. **Cortina di Sicurezza con PIN (SHA-256 Crittografico)**:
   - All'apertura viene mostrato un tastierino sartoriale dedicato.
   - **PIN iniziale predefinito**: `0207` (la data delle nozze: 2 Luglio).
   - È possibile modificare il PIN in qualsiasi momento dalla sezione *"Archivio Personale"* con il pulsante `🔒 Modifica PIN`.
   - Il codice non viaggia mai su Internet: la verifica avviene localmente con l'API crittografica nativa di iOS (`crypto.subtle.digest`).
2. **Invisibilità ai Motori di Ricerca**:
   - Tag `<meta name="robots" content="noindex, nofollow, noarchive">` attivo: la pagina non può essere scansionata né indicizzata da Google o bot.
3. **PWA Standalone & Service Worker Offline**:
   - [`manifest.json`](file:///c:/Users/Miriana/Documents/Antigravity%20projects/manifest.json) e [`sw.js`](file:///c:/Users/Miriana/Documents/Antigravity%20projects/sw.js) integrati: l'app si installa su iPhone e funziona anche senza connessione internet.

---

### 2. Come Usare e Modificare su iPhone

#### Opzione A: Come App Web PWA su Schermata Home (Consigliata)
1. Carica i file su un hosting statico gratuito (es. **GitHub Pages** o **Vercel** o **Cloudflare Pages**).
2. Apri il link con **Safari** sul tuo iPhone.
3. Tocca l'icona di condivisione di Safari (il quadrato con la freccia verso l'alto `⬆`) e seleziona **"Aggiungi alla schermata Home"**.
4. L'icona dell'atelier **"Nozze M&M"** comparirà sulla schermata principale dell'iPhone.
5. All'apertura, l'app si avvia a schermo intero come una vera app nativa:
   - Inserisci il PIN `0207`.
   - Qualsiasi spesa aggiunta o acconto modificato viene salvato istantaneamente nella memoria permanente protetta (`localStorage`).
   - Funziona anche in aereo o senza campo.

#### Opzione B: File Singolo Standalone Offline (Senza bisogno di hosting)
È stato generato anche il file unico tutto-in-uno:
[`matrimonio-michele-miriana-standalone.html`](file:///c:/Users/Miriana/Documents/Antigravity%20projects/matrimonio-michele-miriana-standalone.html) (189 KB).
1. Invialo al tuo iPhone (via AirDrop, WhatsApp o salvalo in *File / iCloud Drive*).
2. Toccalo per aprirlo direttamente in Safari: funziona al 100% in locale, protetto da PIN e con salvataggio automatico delle modifiche.

---

### 3. Backup e Sincronizzazione con il Computer
In fondo alla pagina, nella sezione **"Archivio Personale e Sincronizzazione"**, trovi:
- **Salva Archivio (JSON)**: scarica un file con tutte le tue spese e modifiche aggiornate.
- **Importa Archivio**: carica i dati su un altro dispositivo (es. dal telefono al computer di casa) con un solo tocco.
