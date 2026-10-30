/**
 * Dati Iniziali Matrimonio — Michele & Miriana
 * 2 Luglio 2027 — Tenuta Tana di Volpe
 */

const INITIAL_WEDDING_DATA = {
  couple: {
    partner1: "Michele",
    partner2: "Miriana",
    title: "Michele & Miriana",
    subtitle: "Il Nostro Matrimonio"
  },
  details: {
    date: "2027-07-02",
    time: "17:00",
    venue: "Tenuta Tana di volpe",
    estimatedGuests: 100,
    costPerGuest: 150,
    budgetNote: "Budget stimato per 100 invitati a Tenuta Tana di volpe"
  },
  savingsPlan: {
    startDate: "2025-10-10",
    targetDate: "2027-07-02",
    michele: {
      initialSavings: 9000,
      monthlySavings: 740,
      accumulatedSoFar: 8140,
      remainingToSave: 6660,
      projectedTotal: 20690
    },
    miriana: {
      initialSavings: 5000,
      monthlySavings: 400,
      accumulatedSoFar: 4400,
      remainingToSave: 3600,
      projectedTotal: 18500
    },
    familyContribution: {
      source: "Amedeo e Anna",
      totalPledged: 10000,
      alreadyAdvanced: 1500, // Anticipati per catering
      remainingAvailable: 8500,
      notes: "Contributo genitori per matrimonio (1.500€ anticipati per caparra catering)"
    },
    weddingGifts: {
      estimated: 10000,
      notes: "Stima regali/buste dagli invitati"
    }
  },
  categories: [
    {
      id: "location_catering",
      name: "Location e Catering",
      color: "#AA6352",
      icon: "villa",
      description: "Tenuta, banchetto, servizio tavoli e bomboniere"
    },
    {
      id: "abbigliamento",
      name: "Abbigliamento e Bellezza",
      color: "#9C7A65",
      icon: "vestito",
      description: "Abiti degli sposi, intimo, acconciatura e make-up"
    },
    {
      id: "foto_video",
      name: "Fotografia e Video",
      color: "#4A6B5B",
      icon: "camera",
      description: "Reportage foto, video cinematografico e album"
    },
    {
      id: "fiori_decorazioni",
      name: "Fiori e Decorazioni",
      color: "#68846E",
      icon: "fiori",
      description: "Bouquet sposa, rito civile e taglio torta"
    },
    {
      id: "musica",
      name: "Musica e Spettacolo",
      color: "#835C7E",
      icon: "musica",
      description: "Rito civile, DJ, band dal vivo e intrattenimento"
    },
    {
      id: "documenti",
      name: "Documenti e Cerimonia",
      color: "#6B7280",
      icon: "documenti",
      description: "Pratiche burocratiche comunali e celebrante"
    },
    {
      id: "fedi",
      name: "Fedi e Gioielli",
      color: "#C49B5B",
      icon: "fedi",
      description: "Fedi nuziali e dettagli preziosi"
    },
    {
      id: "partecipazioni",
      name: "Partecipazioni e Grafica",
      color: "#8E7D6B",
      icon: "inviti",
      description: "Inviti cartacei, buste e confetti speciali"
    },
    {
      id: "trasporti",
      name: "Trasporti e Alloggi",
      color: "#5B7382",
      icon: "trasporti",
      description: "Alloggio e navette per gli ospiti fuori sede"
    },
    {
      id: "luna_miele",
      name: "Luna di Miele",
      color: "#3F7A8D",
      icon: "viaggio",
      description: "Voli, resort, escursioni ed esperienze"
    },
    {
      id: "extra",
      name: "Extra e Imprevisti",
      color: "#99583D",
      icon: "extra",
      description: "Wedding planner, regali testimoni e fondo sicurezza"
    }
  ],
  expenses: [
    // LOCATION E CATERING
    {
      id: "exp_1",
      categoryId: "location_catering",
      item: "Location cerimonia",
      supplier: "Tenuta Tana di volpe",
      budget: 5000,
      paidMichele: 0,
      paidMiriana: 1000,
      dueDate: "2027-07-02",
      notes: "Tenuta Tana di volpe - acconto versato da Miriana",
      status: "acconto" // "pianificato" | "acconto" | "saldato"
    },
    {
      id: "exp_2",
      categoryId: "location_catering",
      item: "Catering (150€ x 100 ospiti)",
      supplier: "Catering convenzionato",
      budget: 16500,
      paidMichele: 1500,
      paidMiriana: 1500,
      dueDate: "2027-07-02",
      notes: "Aperitivo, pranzo/cena, bevande (1.500€ Michele + 1.500€ Miriana da contributo Amedeo/Anna)",
      status: "acconto"
    },
    {
      id: "exp_3",
      categoryId: "location_catering",
      item: "Bomboniera e Confetti",
      supplier: "",
      budget: 800,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-05-15",
      notes: "Confetti, bomboniere per ospiti",
      status: "pianificato"
    },
    {
      id: "exp_4",
      categoryId: "location_catering",
      item: "Servizio extra tenuta",
      supplier: "Tenuta Tana di volpe",
      budget: 600,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-06-15",
      notes: "Noleggio attrezzature extra, tavolo imperiale misto, sedie rito, fontane fredde",
      status: "pianificato"
    },

    // ABBIGLIAMENTO E BELLEZZA
    {
      id: "exp_5",
      categoryId: "abbigliamento",
      item: "Abito da sposa",
      supplier: "Atelier sposa",
      budget: 4000,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-04-01",
      notes: "Vestito + accessori + velo + scarpe + accessori capelli",
      status: "pianificato"
    },
    {
      id: "exp_6",
      categoryId: "abbigliamento",
      item: "Lingerie sposa",
      supplier: "",
      budget: 200,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-05-01",
      notes: "Intimo per il matrimonio",
      status: "pianificato"
    },
    {
      id: "exp_7",
      categoryId: "abbigliamento",
      item: "Abito da sposo",
      supplier: "Sartoria sposo",
      budget: 1000,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-04-15",
      notes: "Abito + camicia + scarpe",
      status: "pianificato"
    },
    {
      id: "exp_8",
      categoryId: "abbigliamento",
      item: "Accessori sposo",
      supplier: "",
      budget: 500,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-05-01",
      notes: "Cravatta, gemelli, orologio",
      status: "pianificato"
    },
    {
      id: "exp_9",
      categoryId: "abbigliamento",
      item: "Makeup artist sposa",
      supplier: "",
      budget: 400,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-06-01",
      notes: "Trucco sposa giorno matrimonio + prova trucco",
      status: "pianificato"
    },
    {
      id: "exp_10",
      categoryId: "abbigliamento",
      item: "Parrucchiere sposa",
      supplier: "",
      budget: 300,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-06-01",
      notes: "Acconciatura sposa + prove",
      status: "pianificato"
    },

    // FOTOGRAFIA E VIDEO
    {
      id: "exp_11",
      categoryId: "foto_video",
      item: "Servizio fotografico completo",
      supplier: "Fotografo professionista",
      budget: 3500,
      paidMichele: 1000,
      paidMiriana: 0,
      dueDate: "2027-07-02",
      notes: "Cerimonia + ricevimento + reportage - caparra versata da Michele (1.000€)",
      status: "acconto"
    },

    // FIORI E DECORAZIONI
    {
      id: "exp_12",
      categoryId: "fiori_decorazioni",
      item: "Bouquet sposa",
      supplier: "Flower designer",
      budget: 200,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-07-01",
      notes: "Bouquet principale + bouquet da lancio",
      status: "pianificato"
    },
    {
      id: "exp_13",
      categoryId: "fiori_decorazioni",
      item: "Addobbi rito civile e tenuta",
      supplier: "Flower designer",
      budget: 800,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-06-20",
      notes: "Decorazioni luogo cerimonia (fiori da riusare anche per tavolo e taglio torta)",
      status: "pianificato"
    },

    // MUSICA E SPETTACOLO
    {
      id: "exp_14",
      categoryId: "musica",
      item: "Musica cerimonia",
      supplier: "Musicisti",
      budget: 550,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-06-15",
      notes: "Musicisti rito civile (Violino e arpa)",
      status: "pianificato"
    },
    {
      id: "exp_15",
      categoryId: "musica",
      item: "DJ ricevimento",
      supplier: "DJ Set",
      budget: 500,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-06-25",
      notes: "DJ per festa finale + noleggio attrezzature audio/luci",
      status: "pianificato"
    },
    {
      id: "exp_16",
      categoryId: "musica",
      item: "Band dal vivo",
      supplier: "Gruppo Arechi",
      budget: 4700,
      paidMichele: 610,
      paidMiriana: 0,
      dueDate: "2027-07-02",
      notes: "Gruppo musicale per ricevimento (Gruppo Arechi) - 100€ di sconto applicato su 4.800€, acconto 610€ Michele",
      status: "acconto"
    },
    {
      id: "exp_17",
      categoryId: "musica",
      item: "Animazione bambini",
      supplier: "",
      budget: 0,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "",
      notes: "Animatore per bambini (da valutare in base a conferme piccoli ospiti)",
      status: "pianificato"
    },

    // DOCUMENTI E CERIMONIA
    {
      id: "exp_18",
      categoryId: "documenti",
      item: "Pratiche comune",
      supplier: "Ufficio Stato Civile",
      budget: 150,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-03-01",
      notes: "Pubblicazioni di matrimonio, marche da bollo e documenti civili",
      status: "pianificato"
    },
    {
      id: "exp_19",
      categoryId: "documenti",
      item: "Celebrante",
      supplier: "",
      budget: 400,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-06-01",
      notes: "Celebrante per rito civile personalizzato",
      status: "pianificato"
    },
    {
      id: "exp_20",
      categoryId: "documenti",
      item: "Tenuta rito civile",
      supplier: "Comune / Location",
      budget: 300,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-05-01",
      notes: "Diritti comunali per celebrazione fuori casa comunale presso la tenuta",
      status: "pianificato"
    },

    // FEDI E GIOIELLI
    {
      id: "exp_21",
      categoryId: "fedi",
      item: "Fedi nuziali",
      supplier: "Gioielleria",
      budget: 1200,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-04-15",
      notes: "Coppia anelli matrimonio in oro con incisioni",
      status: "pianificato"
    },

    // PARTECIPAZIONI
    {
      id: "exp_22",
      categoryId: "partecipazioni",
      item: "Partecipazioni matrimonio",
      supplier: "Tipografia / Grafico",
      budget: 300,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-01-15",
      notes: "Inviti cartacei + buste calligrafate + save the date digitale",
      status: "pianificato"
    },
    {
      id: "exp_23",
      categoryId: "partecipazioni",
      item: "Confetti per parenti lontani",
      supplier: "",
      budget: 100,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-05-15",
      notes: "Confezioni per persone non invitate o assenti",
      status: "pianificato"
    },

    // TRASPORTI E ALLOGGI
    {
      id: "exp_24",
      categoryId: "trasporti",
      item: "Alloggio ospiti fuori sede",
      supplier: "B&B / Hotel zona tenuta",
      budget: 1000,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-05-01",
      notes: "Contributo per accoglienza ospiti lontani",
      status: "pianificato"
    },

    // LUNA DI MIELE
    {
      id: "exp_25",
      categoryId: "luna_miele",
      item: "Voli aerei viaggio di nozze",
      supplier: "Agenzia viaggi",
      budget: 0,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "",
      notes: "Biglietti aerei (da inserire preventivo agenzia)",
      status: "pianificato"
    },
    {
      id: "exp_26",
      categoryId: "luna_miele",
      item: "Alloggio / Resort viaggio",
      supplier: "",
      budget: 0,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "",
      notes: "Hotel/resort luna di miele",
      status: "pianificato"
    },
    {
      id: "exp_27",
      categoryId: "luna_miele",
      item: "Attività e tour guidati",
      supplier: "",
      budget: 0,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "",
      notes: "Tour, cene speciali, esperienze",
      status: "pianificato"
    },
    {
      id: "exp_28",
      categoryId: "luna_miele",
      item: "Spese varie viaggio",
      supplier: "",
      budget: 0,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "",
      notes: "Trasporti locali, shopping, mance",
      status: "pianificato"
    },

    // EXTRA E IMPREVISTI
    {
      id: "exp_29",
      categoryId: "extra",
      item: "Wedding planner / Coordinamento",
      supplier: "",
      budget: 1000,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-06-01",
      notes: "Organizzatore matrimonio / coordinamento giornata",
      status: "pianificato"
    },
    {
      id: "exp_30",
      categoryId: "extra",
      item: "Regali testimoni e damigelle",
      supplier: "",
      budget: 400,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-05-20",
      notes: "Doni speciali per testimoni e damigelle",
      status: "pianificato"
    },
    {
      id: "exp_31",
      categoryId: "extra",
      item: "Fondo imprevisti ed emergenze",
      supplier: "Fondo di riserva",
      budget: 1200,
      paidMichele: 0,
      paidMiriana: 0,
      dueDate: "2027-07-01",
      notes: "Buffer per emergenze (circa 5% del budget)",
      status: "pianificato"
    }
  ]
};
