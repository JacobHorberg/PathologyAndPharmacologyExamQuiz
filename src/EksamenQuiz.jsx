import { useState, useEffect, useCallback, useMemo } from "react";

/* ============================================================================
   HOW TO ADD QUESTIONS
   ----------------------------------------------------------------------------
   Each question is one object inside the QUESTIONS list below.
   Copy this template, fill it in, and paste it into the list (separate each
   question with a comma). That's the only thing you ever need to edit.

   {
     topic: "Hjerte og kar",     // The subject. Type any name you like.
     question: "The question text goes here?",
     options: [
       "First answer",      // becomes A
       "Second answer",     // becomes B
       "Third answer",      // becomes C
       "Fourth answer",     // becomes D
       // A 5th option for E is fine too — any number of options works.
     ],
     correct: "C",          // The LETTER of the correct answer (A, B, C, D, E)
     explanation: "Why this answer is correct. Shown after answering.",
   },

   GROUPING BY TOPIC:
   - The "topic" field controls grouping. Questions with the SAME topic name
     are automatically shown together in the menu.
   - Want a new topic? Just type a new name — it appears in the menu by itself.
   - Forget the topic? It lands under "Andet". No harm done.

   OTHER NOTES:
   - "correct" must match an option by position (A = first option, etc.).
   - The letter is not case-sensitive ("c" works).
   - Leave "explanation" as "" if you don't have one yet.
   ============================================================================ */

const QUESTIONS = [
  // ===== BASAL PATOLOGI =====

  // --- Celle- og vævsadaptationer ---
  {
    topic: "Basal patologi",
    question:
      "Hvad kaldes en forøgelse af et vævs størrelse, som skyldes et øget ANTAL celler?",
    options: ["Hypertrofi", "Hyperplasi", "Atrofi", "Metaplasi"],
    correct: "B",
    explanation:
      "Hyperplasi = flere celler. Hypertrofi betyder derimod, at de enkelte celler bliver større, mens antallet er uændret.",
  },
  {
    topic: "Basal patologi",
    question:
      "En kvinde styrketræner intensivt, og hendes skeletmuskelceller bliver større og kraftigere. Hvilken celleadaptation er der tale om?",
    options: ["Hyperplasi", "Hypertrofi", "Dysplasi", "Metaplasi"],
    correct: "B",
    explanation:
      "Skeletmuskelceller kan ikke dele sig, så vævet vokser ved at de enkelte celler bliver større — det er hypertrofi.",
  },
  {
    topic: "Basal patologi",
    question: "Hvad er metaplasi?",
    options: [
      "Ukontrolleret, malign cellevækst",
      "Skrumpning af et organ pga. tab af celler",
      "En reversibel ændring, hvor én moden celletype erstattes af en anden",
      "Et fald i celledelingshastigheden",
    ],
    correct: "C",
    explanation:
      "Metaplasi er, at én moden celletype erstattes af en anden (ofte mere robust) type, typisk som svar på kronisk irritation. Den er som udgangspunkt reversibel.",
  },
  {
    topic: "Basal patologi",
    question:
      "Hos en patient med langvarig sure opstød (refluks) ses, at det normale pladeepitel nederst i spiserøret er erstattet af cylinderepitel (Barretts øsofagus). Hvilken proces er dette et eksempel på?",
    options: ["Atrofi", "Hypertrofi", "Metaplasi", "Hyperplasi"],
    correct: "C",
    explanation:
      "Det er metaplasi — kronisk syrepåvirkning får én epiteltype til at blive erstattet af en anden. Barretts øsofagus øger risikoen for senere dysplasi og kræft.",
  },
  {
    topic: "Basal patologi",
    question:
      "En sengeliggende patient har efter flere ugers immobilisering tydeligt mindre lårmuskulatur. Hvad kaldes denne reduktion i vævets størrelse?",
    options: ["Atrofi", "Aplasi", "Dysplasi", "Nekrose"],
    correct: "A",
    explanation:
      "Atrofi er skrumpning af et tidligere normalt udviklet væv. Her skyldes det inaktivitet (inaktivitetsatrofi).",
  },

  // --- Basale vævsskader og heling ---
  {
    topic: "Basal patologi",
    question: "Hvad er den væsentligste forskel på nekrose og apoptose?",
    options: [
      "Nekrose er programmeret celledød, apoptose er ukontrolleret",
      "Apoptose er programmeret og ryddelig celledød uden inflammation, mens nekrose er ukontrolleret celledød der udløser inflammation",
      "Det er to ord for præcis samme proces",
      "Apoptose forekommer kun i kræftceller",
    ],
    correct: "B",
    explanation:
      "Apoptose er styret, 'ryddelig' celledød, der ikke udløser inflammation. Nekrose er ukontrolleret celledød efter skade og udløser typisk inflammation.",
  },
  {
    topic: "Basal patologi",
    question:
      "Hvad kendetegner primær sårheling (sanatio per primam)?",
    options: [
      "Et stort vævstab, der gradvist fyldes op af rigeligt granulationsvæv",
      "At sårranderne ligger tæt sammen (fx en syet incision), så der dannes et smalt ar",
      "En heling der kun foregår i knoglevæv",
      "Et sår der pr. definition er inficeret",
    ],
    correct: "B",
    explanation:
      "Ved primær heling er sårranderne rene og tætte (fx en kirurgisk incision der sys). Det giver minimalt granulationsvæv og et smalt ar.",
  },
  {
    topic: "Basal patologi",
    question: "Hvad er granulationsvæv?",
    options: [
      "Modent, færdigt arvæv",
      "Dødt, nekrotisk væv",
      "Nydannet bindevæv med nye kapillærer og fibroblaster i et helende sår",
      "En ophobning af pus",
    ],
    correct: "C",
    explanation:
      "Granulationsvæv er det rødlige, nydannede væv med nye blodkar (angiogenese) og fibroblaster, der fylder sårdefekten ud under helingen.",
  },
  {
    topic: "Basal patologi",
    question: "Hvilken af følgende faktorer HÆMMER sårheling?",
    options: [
      "God blodforsyning til såret",
      "Tilstrækkeligt indtag af protein og C-vitamin",
      "Dårligt reguleret diabetes mellitus",
      "Ung alder",
    ],
    correct: "C",
    explanation:
      "Dårligt reguleret diabetes nedsætter sårheling — bl.a. via nedsat mikrocirkulation, svækket immunforsvar og neuropati. De øvrige faktorer fremmer heling.",
  },
  {
    topic: "Basal patologi",
    question: "Hvad betyder iskæmi?",
    options: [
      "For meget ilttilførsel til et væv",
      "Utilstrækkelig blodforsyning og dermed ilttilførsel til et væv",
      "Betændelse i en blodåre",
      "Ophobning af væske i vævet",
    ],
    correct: "B",
    explanation:
      "Iskæmi er nedsat blodforsyning, så vævet får for lidt ilt og næring. Det kan føre til hypoksisk skade og i værste fald nekrose (infarkt).",
  },

  // --- Immunsystemet ---
  {
    topic: "Basal patologi",
    question:
      "Hvad kendetegner det medfødte (innate) immunforsvar sammenlignet med det adaptive?",
    options: [
      "Det er langsomt og meget specifikt",
      "Det danner hukommelsesceller mod specifikke mikroorganismer",
      "Det reagerer hurtigt og uspecifikt som kroppens første forsvarslinje",
      "Det består udelukkende af antistoffer",
    ],
    correct: "C",
    explanation:
      "Det medfødte immunforsvar (hud, slimhinder, neutrofile, makrofager m.m.) reagerer hurtigt og uspecifikt. Det adaptive er langsommere, specifikt og danner hukommelse.",
  },
  {
    topic: "Basal patologi",
    question: "Hvilke celler producerer antistoffer?",
    options: [
      "T-hjælperceller",
      "Plasmaceller (modne B-lymfocytter)",
      "Neutrofile granulocytter",
      "Trombocytter",
    ],
    correct: "B",
    explanation:
      "B-lymfocytter modnes til plasmaceller, som producerer antistoffer (immunglobuliner).",
  },
  {
    topic: "Basal patologi",
    question: "Hvad karakteriserer en autoimmun sygdom?",
    options: [
      "En infektion forårsaget af bakterier",
      "En tilstand hvor immunforsvaret angriber kroppens eget væv",
      "En medfødt mangel på immunceller",
      "En allergisk reaktion på fx pollen",
    ],
    correct: "B",
    explanation:
      "Ved autoimmunitet retter immunsystemet sig fejlagtigt mod kroppens egne celler og væv — fx ved type 1-diabetes og reumatoid artrit.",
  },
  {
    topic: "Basal patologi",
    question:
      "En patient får inden for få minutter efter et bistik hævelse, udbredt udslæt, åndenød og blodtryksfald. Hvilken type hypersensitivitetsreaktion er dette typisk udtryk for?",
    options: [
      "Straksallergi (type I, IgE-medieret)",
      "En forsinket reaktion, der først kommer efter flere døgn",
      "En langsomt udviklende autoimmun reaktion",
      "En helt normal fysiologisk reaktion uden risiko",
    ],
    correct: "A",
    explanation:
      "Det er en type I- (straks-/IgE-medieret) reaktion — anafylaksi, der opstår inden for minutter og kan give livstruende kredsløbskollaps.",
  },
  {
    topic: "Basal patologi",
    question: "Hvad er en hensigtsmæssig funktion af feber ved infektion?",
    options: [
      "Det er udelukkende en skadelig bivirkning uden gavnlig funktion",
      "At hæmme mange mikroorganismers vækst og styrke immunresponset",
      "At sænke kroppens stofskifte",
      "At nedsætte antallet af hvide blodlegemer",
    ],
    correct: "B",
    explanation:
      "Feber er en del af forsvaret: den hæmmer mange mikroorganismers vækst og fremmer immuncellernes aktivitet.",
  },

  // --- Akut og kronisk inflammation ---
  {
    topic: "Basal patologi",
    question: "Hvilke er de fem klassiske kardinaltegn på akut inflammation?",
    options: [
      "Rødme, varme, hævelse, smerte og nedsat funktion",
      "Feber, kvalme, opkast, diarré og udslæt",
      "Bleghed, kulde, atrofi, kløe og træthed",
      "Hoste, åndenød, brystsmerter, ødem og cyanose",
    ],
    correct: "A",
    explanation:
      "De klassiske tegn er rubor (rødme), calor (varme), tumor (hævelse), dolor (smerte) og functio laesa (nedsat funktion).",
  },
  {
    topic: "Basal patologi",
    question: "Hvilken celletype dominerer ved AKUT inflammation?",
    options: [
      "Lymfocytter",
      "Neutrofile granulocytter",
      "Plasmaceller",
      "Fibroblaster",
    ],
    correct: "B",
    explanation:
      "Neutrofile granulocytter er de første og dominerende celler ved akut inflammation. Makrofager og lymfocytter dominerer mere ved kronisk inflammation.",
  },
  {
    topic: "Basal patologi",
    question:
      "Hvad sker der med de små blodkar i et område med akut inflammation?",
    options: [
      "De trækker sig sammen, så området bliver blegt og koldt",
      "De udvider sig og bliver mere gennemtrængelige",
      "De forsvinder helt fra området",
      "De forkalker",
    ],
    correct: "B",
    explanation:
      "Ved akut inflammation sker vasodilatation og øget karpermeabilitet, så mere blod og væske (ekssudat) når frem. Det giver rødme, varme og hævelse.",
  },
  {
    topic: "Basal patologi",
    question:
      "Hvad kendetegner kronisk inflammation sammenlignet med akut inflammation?",
    options: [
      "Den varer kortere tid og domineres af neutrofile",
      "Den er langvarig, domineres af makrofager og lymfocytter og ledsages ofte af vævsdestruktion og bindevævsdannelse",
      "Den giver aldrig vævsskade",
      "Den ses udelukkende ved allergi",
    ],
    correct: "B",
    explanation:
      "Kronisk inflammation er langvarig, drives af makrofager og lymfocytter og ledsages ofte af samtidig vævsdestruktion og fibrose (arvævsdannelse).",
  },
  {
    topic: "Basal patologi",
    question: "Hvad består pus (materie) hovedsageligt af?",
    options: [
      "Klar vævsvæske",
      "Døde neutrofile granulocytter, vævsrester og mikroorganismer",
      "Nydannet, sundt bindevæv",
      "Levret blod",
    ],
    correct: "B",
    explanation:
      "Pus består primært af døde neutrofile granulocytter, nedbrudt væv og ofte bakterier — typisk ved bakteriel infektion.",
  },

  // --- Mikroorganismer og infektioner ---
  {
    topic: "Basal patologi",
    question: "Mod hvilken type infektion vil antibiotika typisk være virkningsløs?",
    options: [
      "En bakteriel lungebetændelse",
      "En virusinfektion som almindelig forkølelse",
      "En bakteriel urinvejsinfektion",
      "En bakteriel sårinfektion",
    ],
    correct: "B",
    explanation:
      "Antibiotika virker på bakterier, ikke på virus. Forkølelse er en virusinfektion og skal derfor ikke behandles med antibiotika.",
  },
  {
    topic: "Basal patologi",
    question:
      "Hvad bygger skelnen mellem gram-positive og gram-negative bakterier på?",
    options: [
      "Bakteriernes størrelse",
      "Opbygningen af bakteriernes cellevæg, som farves forskelligt ved Gram-farvning",
      "Om bakterierne kan bevæge sig",
      "Bakteriernes farve set i dagslys",
    ],
    correct: "B",
    explanation:
      "Gram-farvning skelner ud fra cellevæggens opbygning: gram-positive (tyk peptidoglykan) bliver blå/violette, gram-negative bliver røde.",
  },
  {
    topic: "Basal patologi",
    question: "Hvad er sepsis?",
    options: [
      "En lokal hudinfektion uden almensymptomer",
      "En livstruende tilstand med et systemisk, dysreguleret respons på en infektion",
      "En allergisk reaktion på medicin",
      "En virussygdom der altid er ufarlig",
    ],
    correct: "B",
    explanation:
      "Sepsis er en livstruende, systemisk reaktion på infektion, hvor immunresponset også skader kroppens egne organer. Det kræver hurtig behandling.",
  },
  {
    topic: "Basal patologi",
    question: "Hvad menes med kroppens 'normalflora'?",
    options: [
      "Sygdomsfremkaldende bakterier i blodbanen",
      "De mikroorganismer, der naturligt lever på og i kroppen uden normalt at gøre skade",
      "Virus i lungerne",
      "Svampe, der altid medfører infektion",
    ],
    correct: "B",
    explanation:
      "Normalfloraen er de mikroorganismer (fx tarmbakterier), der normalt findes på kroppen og ofte er gavnlige, men som kan give infektion, hvis de havner et forkert sted.",
  },
  {
    topic: "Basal patologi",
    question:
      "En patient har en infektion, der spredes via små dråber, når vedkommende hoster og nyser. Hvilken smittevej er der tale om?",
    options: [
      "Fækal-oral smitte",
      "Dråbesmitte",
      "Blodbåren smitte",
      "Seksuel smitte",
    ],
    correct: "B",
    explanation:
      "Smitte via dråber fra luftvejene ved hoste og nys kaldes dråbesmitte (ses fx ved influenza).",
  },

  // --- Basal billeddiagnostik ---
  {
    topic: "Basal patologi",
    question:
      "Hvilken undersøgelse er bedst egnet til hurtigt at vurdere en mistænkt knoglefraktur?",
    options: [
      "Almindeligt røntgen",
      "Ultralyd",
      "EKG",
      "En blodprøve",
    ],
    correct: "A",
    explanation:
      "Røntgen er hurtigt, billigt og velegnet til at fremstille knogler og påvise frakturer.",
  },
  {
    topic: "Basal patologi",
    question:
      "Hvilken af følgende billeddiagnostiske metoder anvender IKKE ioniserende stråling?",
    options: [
      "Røntgen",
      "CT-scanning",
      "MR-scanning",
      "Konventionel gennemlysning",
    ],
    correct: "C",
    explanation:
      "MR (magnetisk resonans) bruger magnetfelt og radiobølger og giver ingen ioniserende stråling. Røntgen, CT og gennemlysning bruger røntgenstråling.",
  },
  {
    topic: "Basal patologi",
    question: "Hvad er en CT-scanning grundlæggende?",
    options: [
      "En undersøgelse med lydbølger",
      "En computerbearbejdet serie af røntgenbilleder, der giver snitbilleder af kroppen",
      "En måling af hjertets elektriske aktivitet",
      "En undersøgelse med magnetfelt",
    ],
    correct: "B",
    explanation:
      "CT (computertomografi) bruger røntgenstråler fra mange vinkler, som computeren samler til detaljerede snitbilleder (tværsnit) af kroppen.",
  },
  {
    topic: "Basal patologi",
    question: "Til hvad er ultralydsscanning særligt velegnet?",
    options: [
      "Detaljeret afbildning af knoglernes indre struktur",
      "Undersøgelse af bløddele, organer og fostre uden brug af stråling",
      "Vurdering af luftfyldt lungevæv",
      "Detaljeret afbildning af hjernen gennem kraniet hos voksne",
    ],
    correct: "B",
    explanation:
      "Ultralyd egner sig godt til bløddele, organer (fx lever og nyrer) og fosterundersøgelser og bruger ingen ioniserende stråling. Den egner sig dårligt til knogler og luftfyldt væv.",
  },
  {
    topic: "Basal patologi",
    question:
      "Hvorfor tilstræber man at begrænse antallet af CT-scanninger, særligt hos børn?",
    options: [
      "Fordi CT er meget dyrt og tager lang tid",
      "På grund af stråledosis, da ioniserende stråling indebærer en lille øget kræftrisiko",
      "Fordi CT kræver indlæggelse i flere dage",
      "Fordi CT-billeder ikke kan gemmes",
    ],
    correct: "B",
    explanation:
      "CT giver en relativt høj dosis ioniserende stråling, der over tid kan øge kræftrisikoen. Børn er mere strålefølsomme, så indikationen vejes ekstra nøje.",
  },
  // ===== LUNGESYGDOMME =====

  // --- Astma ---
  {
    topic: "Lungesygdomme",
    question: "Hvad karakteriserer astma patofysiologisk?",
    options: [
      "En permanent, irreversibel ødelæggelse af alveolerne",
      "En kronisk luftvejsinflammation med bronkial hyperreaktivitet og typisk reversibel obstruktion",
      "En bakteriel infektion i lungevævet",
      "En blodprop i en lungearterie",
    ],
    correct: "B",
    explanation:
      "Astma er en kronisk inflammation i luftvejene med øget følsomhed (hyperreaktivitet). Obstruktionen er typisk reversibel — den kan ophæves spontant eller med medicin.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvilke symptomer er klassiske for astma?",
    options: [
      "Konstant feber og vægttab",
      "Anfaldsvis åndenød, hvæsende vejrtrækning og hoste, ofte værst om natten/tidligt om morgenen",
      "Pludselige brystsmerter med udstråling til venstre arm",
      "Smerter i benene ved gang",
    ],
    correct: "B",
    explanation:
      "Astma giver anfaldsvis åndenød, hvæsen (wheezing) og hoste, ofte med natlige/tidlige morgensymptomer og udløst af triggere.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvilken af følgende er en typisk udløsende faktor (trigger) for et astmaanfald?",
    options: [
      "Indtag af rigeligt vand",
      "Allergener, kold luft, fysisk anstrengelse eller luftvejsinfektion",
      "God søvn",
      "Lavt blodsukker",
    ],
    correct: "B",
    explanation:
      "Astmaanfald udløses ofte af allergener (pollen, husstøvmider, dyrehår), kold luft, anstrengelse, røg eller luftvejsinfektioner.",
  },
  {
    topic: "Lungesygdomme",
    question:
      "En patient får pludselig åndenød og hvæsen under et astmaanfald. Hvilken medicintype giver hurtigst lindring?",
    options: [
      "Korttidsvirkende β2-agonist i inhalation (fx salbutamol)",
      "Tabletbehandling med antibiotika",
      "Inhalationssteroid som engangsdosis",
      "Et smertestillende håndkøbspræparat",
    ],
    correct: "A",
    explanation:
      "En korttidsvirkende β2-agonist (SABA) udvider bronkierne hurtigt og er anfaldsbehandlingen ('relieveren') ved astma.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvad er formålet med inhalationssteroid (glukokortikoid) ved astma?",
    options: [
      "At udvide bronkierne akut under et anfald",
      "At dæmpe den underliggende luftvejsinflammation og forebygge anfald",
      "At behandle en bakteriel infektion",
      "At fortynde sejt slim",
    ],
    correct: "B",
    explanation:
      "Inhalationssteroid er den forebyggende ('controller'-)behandling: det dæmper inflammationen i luftvejene over tid og nedsætter antallet af anfald.",
  },
  {
    topic: "Lungesygdomme",
    question:
      "Ved spirometri ses ved astma typisk en obstruktion, der bedres tydeligt efter inhalation af en bronkodilatator. Hvad kaldes dette fund?",
    options: [
      "Irreversibel obstruktion",
      "Reversibel obstruktion",
      "Restriktiv lungefunktion",
      "Normal spirometri",
    ],
    correct: "B",
    explanation:
      "Tydelig bedring i lungefunktionen efter bronkodilatator viser reversibel obstruktion, som er typisk for astma (i modsætning til KOL, hvor den er overvejende irreversibel).",
  },

  // --- KOL ---
  {
    topic: "Lungesygdomme",
    question: "Hvad er den klart hyppigste årsag til KOL?",
    options: [
      "Allergi over for pollen",
      "Tobaksrygning",
      "Virusinfektion i barndommen",
      "Arvelig blodmangel",
    ],
    correct: "B",
    explanation:
      "Langvarig tobaksrygning er den dominerende årsag til KOL. Luftforurening og erhvervsmæssig støv-/røgudsættelse bidrager også.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvad kendetegner luftvejsobstruktionen ved KOL?",
    options: [
      "Den er fuldt reversibel",
      "Den er kronisk og overvejende irreversibel",
      "Den findes kun under anfald og forsvinder helt imellem",
      "Der er slet ingen obstruktion",
    ],
    correct: "B",
    explanation:
      "Ved KOL er obstruktionen kronisk og kun delvist/ikke reversibel — i modsætning til astma, hvor den typisk er reversibel.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvilke symptomer er typiske for KOL?",
    options: [
      "Pludseligt anfald af hvæsen hos en ung uden rygehistorie",
      "Tiltagende åndenød, kronisk hoste og opspyt hos en (tidligere) ryger",
      "Feber og pludselig brystsmerte",
      "Smerter i lægmusklen ved gang",
    ],
    correct: "B",
    explanation:
      "KOL udvikler sig snigende med progredierende åndenød (især ved anstrengelse), kronisk hoste og slimproduktion, typisk hos en ryger gennem mange år.",
  },
  {
    topic: "Lungesygdomme",
    question:
      "Hvilken undersøgelse bruges til at stille KOL-diagnosen og vurdere sværhedsgraden?",
    options: [
      "EKG",
      "Spirometri (lungefunktionsundersøgelse)",
      "Ultralyd af maven",
      "Måling af blodsukker",
    ],
    correct: "B",
    explanation:
      "Spirometri stiller diagnosen — en vedvarende nedsat FEV1/FVC-ratio (under 0,70 efter bronkodilatator) bekræfter den irreversible obstruktion.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvad er en KOL-exacerbation?",
    options: [
      "En permanent helbredelse af sygdommen",
      "En akut forværring af symptomerne, ofte udløst af en luftvejsinfektion",
      "En allergisk hudreaktion",
      "Et fald i blodtrykket",
    ],
    correct: "B",
    explanation:
      "En exacerbation er en akut forværring med øget åndenød, hoste og/eller opspyt — ofte udløst af en virus- eller bakterieinfektion og en hyppig årsag til indlæggelse.",
  },
  {
    topic: "Lungesygdomme",
    question:
      "Hvad er den væsentligste og mest effektive intervention for at bremse udviklingen af KOL?",
    options: [
      "Rygestop",
      "Øget indtag af C-vitamin",
      "Sengeleje",
      "Daglig brug af antibiotika",
    ],
    correct: "A",
    explanation:
      "Rygestop er det vigtigste — det er den eneste intervention, der tydeligt kan bremse det fortsatte fald i lungefunktionen ved KOL.",
  },

  // --- Pneumoni ---
  {
    topic: "Lungesygdomme",
    question: "Hvad er pneumoni?",
    options: [
      "En blodprop i en lungearterie",
      "En infektion/inflammation i selve lungevævet (alveolerne)",
      "En kronisk forsnævring af bronkierne",
      "En ophobning af luft i lungehinden",
    ],
    correct: "B",
    explanation:
      "Pneumoni (lungebetændelse) er en infektion i lungeparenkymet, hvor alveolerne fyldes med inflammatorisk væske/ekssudat.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvilke symptomer er typiske for en bakteriel pneumoni?",
    options: [
      "Feber, hoste med opspyt, åndenød og evt. pleuritiske brystsmerter",
      "Smerter i benene og hævede ankler",
      "Kløende udslæt over hele kroppen",
      "Synsforstyrrelser og hovedpine",
    ],
    correct: "A",
    explanation:
      "Klassisk ses feber, kulderystelser, produktiv hoste, åndenød og brystsmerter, der forværres ved vejrtrækning (pleuritiske).",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvilken bakterie er den hyppigste årsag til samfundserhvervet pneumoni?",
    options: [
      "Streptococcus pneumoniae (pneumokok)",
      "Staphylococcus aureus",
      "Escherichia coli",
      "Mycobacterium tuberculosis",
    ],
    correct: "A",
    explanation:
      "Streptococcus pneumoniae (pneumokokken) er den hyppigste årsag til samfundserhvervet lungebetændelse.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvilken billeddiagnostisk undersøgelse bekræfter typisk en pneumoni?",
    options: [
      "MR-scanning af hjernen",
      "Røntgen af thorax (brystkasse), som kan vise et infiltrat",
      "Ultralyd af benene",
      "EKG",
    ],
    correct: "B",
    explanation:
      "Røntgen af thorax kan vise et infiltrat (fortætning) i lungen, hvilket understøtter diagnosen pneumoni.",
  },
  {
    topic: "Lungesygdomme",
    question:
      "Hvad hører man ofte ved stetoskopi (auskultation) over et område med pneumoni?",
    options: [
      "Helt normal, ren respiration",
      "Knitren/krepitation (fugtige rallelyde)",
      "Ingen lyde overhovedet",
      "En jævn, summende mislyd fra hjertet",
    ],
    correct: "B",
    explanation:
      "Over et pneumonisk område høres typisk knitren/krepitation, fordi alveolerne er fyldt med væske. Der kan også være nedsat respirationslyd.",
  },
  {
    topic: "Lungesygdomme",
    question:
      "En 84-årig kvinde indlægges med konfusion, nedsat appetit og et enkelt fald — uden tydelig feber eller hoste. Hvad er vigtigt at huske om infektioner som pneumoni hos ældre?",
    options: [
      "De kan præsentere sig atypisk, fx med konfusion, fald eller almen svækkelse frem for klassiske symptomer",
      "De optræder altid med høj feber og kraftig hoste",
      "De forekommer aldrig hos ældre",
      "De kræver aldrig behandling",
    ],
    correct: "A",
    explanation:
      "Hos ældre kan infektioner præsentere sig atypisk — fx med konfusion, fald, nedsat funktionsniveau eller appetitløshed — uden de klassiske tegn. Det kræver høj opmærksomhed.",
  },

  // --- Lungeemboli ---
  {
    topic: "Lungesygdomme",
    question: "Hvad er en lungeemboli?",
    options: [
      "En infektion i lungevævet",
      "En tilstopning af en lungearterie, oftest af en blodprop",
      "En kronisk forsnævring af luftvejene",
      "En væskeansamling i lungehinden",
    ],
    correct: "B",
    explanation:
      "Ved lungeemboli tilstoppes en lungearterie (eller gren heraf) — oftest af en blodprop, der er løsnet og ført med blodet til lungen.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvorfra stammer blodproppen ved en lungeemboli oftest?",
    options: [
      "Fra en dyb venetrombose (DVT) i benene",
      "Fra en arterie i hjernen",
      "Fra hjerteklapperne",
      "Fra lungevævet selv",
    ],
    correct: "A",
    explanation:
      "Langt de fleste lungeembolier stammer fra en dyb venetrombose i benenes/bækkenets dybe vener. Proppen løsner sig og føres til lungekredsløbet.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvilke symptomer er typiske ved en lungeemboli?",
    options: [
      "Langsomt indsættende hoste over flere uger",
      "Pludselig åndenød, brystsmerter (ofte pleuritiske) og hurtig puls",
      "Smerter i maven og diarré",
      "Hævede led i hænderne",
    ],
    correct: "B",
    explanation:
      "Klassisk ses pludselig åndenød, takykardi og pleuritiske brystsmerter; nogle får hæmoptyse (blodigt opspyt). En stor emboli kan give kredsløbskollaps.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvilken af følgende er en kendt risikofaktor for lungeemboli/DVT?",
    options: [
      "Daglig motion",
      "Langvarig immobilisering, nylig operation, cancer eller graviditet",
      "Højt indtag af vand",
      "Lavt kolesterol",
    ],
    correct: "B",
    explanation:
      "Risikofaktorer følger Virchows triade (nedsat blodstrøm, øget koagulationstendens, karvægsskade): immobilisering, kirurgi, cancer, østrogen/p-piller og graviditet.",
  },
  {
    topic: "Lungesygdomme",
    question:
      "Hvilken undersøgelse anvendes typisk til at påvise en lungeemboli?",
    options: [
      "CT-angiografi af lungernes kar (CT-pulmonalangiografi)",
      "Røntgen af benene",
      "EKG som eneste undersøgelse",
      "Ultralyd af skjoldbruskkirtlen",
    ],
    correct: "A",
    explanation:
      "CT-pulmonalangiografi (CTPA) er den primære undersøgelse, der direkte kan vise proppen i lungekarrene. D-dimer-blodprøven bruges til at af-/bekræfte mistanken.",
  },
  {
    topic: "Lungesygdomme",
    question:
      "Hvorfor kan en stor (massiv) lungeemboli være akut livstruende?",
    options: [
      "Fordi den giver kraftig feber",
      "Fordi den pludseligt belaster højre hjertehalvdel og kan føre til kredsløbskollaps",
      "Fordi den giver kronisk hoste",
      "Fordi den nedsætter blodsukkeret",
    ],
    correct: "B",
    explanation:
      "En massiv emboli øger pludseligt modstanden i lungekredsløbet og belaster højre ventrikel akut, hvilket kan give blodtryksfald, shock og hjertestop.",
  },

  // --- Symptomer fra lunger/luftveje ---
  {
    topic: "Lungesygdomme",
    question: "Hvad betyder 'dyspnø'?",
    options: [
      "Opspyt af blod",
      "Følelsen af åndenød eller besværet vejrtrækning",
      "Blålig misfarvning af huden",
      "Smerter ved vandladning",
    ],
    correct: "B",
    explanation:
      "Dyspnø er den subjektive fornemmelse af åndenød/besværet vejrtrækning. Den kan optræde i hvile eller ved anstrengelse.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvad er cyanose udtryk for?",
    options: [
      "En blålig misfarvning af hud og slimhinder pga. nedsat iltning af blodet",
      "En rødme i ansigtet pga. feber",
      "En gulfarvning af huden",
      "En hævelse af benene",
    ],
    correct: "A",
    explanation:
      "Cyanose er en blålig misfarvning (ses fx på læber og fingre), der skyldes en høj andel af iltfattigt hæmoglobin — altså nedsat iltning af blodet.",
  },
  {
    topic: "Lungesygdomme",
    question: "Hvad kaldes det, når en patient hoster blod op fra luftvejene?",
    options: ["Hæmatemese", "Hæmoptyse", "Melæna", "Epistaxis"],
    correct: "B",
    explanation:
      "Hæmoptyse er opspyt af blod fra luftvejene/lungerne. (Hæmatemese er blodigt opkast, epistaxis er næseblod.)",
  },
  {
    topic: "Lungesygdomme",
    question:
      "Hvad er forskellen på stridor og hvæsen (wheezing)?",
    options: [
      "Stridor er en høj lyd, typisk på indånding, og tyder på forsnævring i de ØVRE luftveje",
      "Stridor og hvæsen er præcis det samme",
      "Stridor høres kun hos raske personer",
      "Hvæsen tyder altid på en blodprop",
    ],
    correct: "A",
    explanation:
      "Stridor er en høj, ofte inspiratorisk lyd ved forsnævring i de øvre luftveje (fx larynx/trachea). Hvæsen (wheezing) er typisk ekspiratorisk og stammer fra de nedre, snævre luftveje (fx ved astma/KOL).",
  },
  {
    topic: "Lungesygdomme",
    question:
      "Hvad måler en pulsoximeter (saturationsmåler på fingeren)?",
    options: [
      "Blodtrykket",
      "Iltmætningen af blodet (SpO2) samt pulsen",
      "Blodsukkeret",
      "Kropstemperaturen",
    ],
    correct: "B",
    explanation:
      "Pulsoximeteret måler iltmætningen i blodet (SpO2) og pulsfrekvensen. En normal SpO2 er typisk omkring 95-100 % hos en rask voksen.",
  },
  {
    topic: "Lungesygdomme",
    question:
      "En produktiv hoste adskiller sig fra en tør hoste ved at:",
    options: [
      "Der hostes opspyt (slim/ekspektorat) op",
      "Den altid er ufarlig",
      "Den kun forekommer om natten",
      "Den aldrig ledsager infektioner",
    ],
    correct: "A",
    explanation:
      "En produktiv (våd) hoste bringer slim/ekspektorat op og ses ofte ved infektioner og KOL. En tør hoste giver intet opspyt.",
  },
  // ===== NEUROLOGI =====

  // --- Parkinsons sygdom ---
  {
    topic: "Neurologi",
    question: "Hvilke er de klassiske kernesymptomer (kardinalsymptomer) ved Parkinsons sygdom?",
    options: [
      "Hviletremor, rigiditet (muskelstivhed) og bradykinesi (langsomme bevægelser)",
      "Feber, nakkestivhed og lysskyhed",
      "Pludselig halvsidig lammelse og taleforstyrrelse",
      "Anfaldsvis åndenød og hvæsen",
    ],
    correct: "A",
    explanation:
      "Parkinson kendetegnes ved triaden hviletremor, rigiditet og bradykinesi — ofte med tilkommende posturel instabilitet (faldtendens) senere i forløbet.",
  },
  {
    topic: "Neurologi",
    question: "Hvad er den grundlæggende patofysiologiske årsag til Parkinsons sygdom?",
    options: [
      "Demyelinisering af nerver i centralnervesystemet",
      "Tab af dopaminproducerende nerveceller i substantia nigra",
      "En blodprop i en hjernearterie",
      "Antistoffer mod acetylkolinreceptorer",
    ],
    correct: "B",
    explanation:
      "Ved Parkinson degenererer de dopaminproducerende celler i substantia nigra, hvilket giver dopaminmangel i hjernens motoriske kredsløb og dermed bevægesymptomerne.",
  },
  {
    topic: "Neurologi",
    question: "Hvilket lægemiddel er hjørnestenen i den medicinske behandling af Parkinsons sygdom?",
    options: [
      "Levodopa (L-dopa)",
      "Penicillin",
      "Insulin",
      "Acetylsalicylsyre",
    ],
    correct: "A",
    explanation:
      "Levodopa omdannes til dopamin i hjernen og afhjælper dopaminmanglen. Det er den mest effektive symptomatiske behandling ved Parkinson.",
  },

  // --- Demens ---
  {
    topic: "Neurologi",
    question: "Hvad er den hyppigste årsag til demens?",
    options: [
      "Alzheimers sygdom",
      "Parkinsons sygdom",
      "Dissemineret sklerose",
      "Migræne",
    ],
    correct: "A",
    explanation:
      "Alzheimers sygdom er den hyppigste demensform. Vaskulær demens er den næsthyppigste.",
  },
  {
    topic: "Neurologi",
    question: "Hvad kendetegner demens?",
    options: [
      "En akut, forbigående forvirring over få timer",
      "En kronisk, progressiv svækkelse af hukommelse og andre kognitive funktioner, der påvirker dagligdagen",
      "En forbigående lammelse, der går væk i løbet af et døgn",
      "En anfaldsvis, pulserende hovedpine",
    ],
    correct: "B",
    explanation:
      "Demens er en erhvervet, kronisk og typisk fremadskridende svækkelse af kognitive funktioner (hukommelse, sprog, orientering m.m.), som nedsætter funktionsevnen i hverdagen.",
  },

  // --- Delir ---
  {
    topic: "Neurologi",
    question: "Hvad kendetegner delir?",
    options: [
      "En snigende, irreversibel kognitiv svækkelse over år",
      "En akut indsættende, ofte svingende (fluktuerende) forvirringstilstand med opmærksomhedsforstyrrelse",
      "En medfødt tilstand uden udløsende årsag",
      "En kronisk hovedpine",
    ],
    correct: "B",
    explanation:
      "Delir opstår akut, svinger i løbet af døgnet og rammer især opmærksomhed og bevidsthedsniveau. Det er ofte reversibelt, når den udløsende årsag behandles.",
  },
  {
    topic: "Neurologi",
    question:
      "En 82-årig med kendt urinvejsinfektion bliver i løbet af et døgn pludselig forvirret og urolig, med svingende symptomer. Hvad er den mest sandsynlige tilstand?",
    options: [
      "Delir, sandsynligvis udløst af infektionen",
      "Nyopstået Alzheimers demens",
      "Migræne med aura",
      "Et epileptisk anfald",
    ],
    correct: "A",
    explanation:
      "Akut, fluktuerende forvirring hos en ældre med en samtidig infektion peger på delir. Infektion (fx UVI eller pneumoni) er en meget hyppig udløsende årsag.",
  },

  // --- Apopleksi (stroke) ---
  {
    topic: "Neurologi",
    question: "Hvad er den hyppigste type apopleksi (stroke)?",
    options: [
      "Iskæmisk apopleksi (blodprop)",
      "Hæmoragisk apopleksi (hjerneblødning)",
      "Subduralt hæmatom",
      "Migrænøst infarkt",
    ],
    correct: "A",
    explanation:
      "Cirka 85 % af alle apopleksier er iskæmiske (en blodprop blokerer en hjernearterie). Resten skyldes blødning (hæmoragisk apopleksi).",
  },
  {
    topic: "Neurologi",
    question:
      "Hvilke symptomer indgår i 'FAST'-tegnene, man bruger til hurtigt at mistænke apopleksi?",
    options: [
      "Feber, appetitløshed, søvnighed og tørst",
      "Skæv ansigtsmimik, nedsat kraft i en arm og uklar/påvirket tale — og dermed behov for at reagere hurtigt på tid",
      "Hovedpine, kvalme, lysskyhed og kuldegysninger",
      "Hoste, åndenød, brystsmerter og blålige læber",
    ],
    correct: "B",
    explanation:
      "FAST står for Face (skæv ansigtsmimik), Arms (kraftnedsættelse i arm), Speech (taleforstyrrelse) og Time (ring 112 straks). Hurtig erkendelse er afgørende.",
  },
  {
    topic: "Neurologi",
    question:
      "Hvorfor er det afgørende at handle hurtigt ('time is brain') ved mistanke om iskæmisk apopleksi?",
    options: [
      "Fordi symptomerne altid forsvinder af sig selv inden for en time",
      "Fordi behandling, der genåbner karret (fx trombolyse/trombektomi), kun virker inden for et begrænset tidsvindue og redder hjernevæv",
      "Fordi apopleksi ikke kan behandles",
      "Fordi patienten skal faste i mange dage først",
    ],
    correct: "B",
    explanation:
      "Ved iskæmi dør hjernevæv hurtigt. Revaskulariserende behandling (trombolyse/trombektomi) har et snævert tidsvindue, så jo hurtigere, jo mere væv kan reddes.",
  },

  // --- TCI (transitorisk cerebral iskæmi) ---
  {
    topic: "Neurologi",
    question: "Hvad kendetegner en TCI (transitorisk cerebral iskæmi)?",
    options: [
      "Apopleksilignende symptomer, der går helt væk inden for kort tid og uden blivende vævsskade",
      "En permanent halvsidig lammelse",
      "En kronisk hovedpine over måneder",
      "En medfødt misdannelse i hjernen",
    ],
    correct: "A",
    explanation:
      "Ved TCI ('lille drypslag') optræder forbigående iskæmiske symptomer, der svinder uden varigt infarkt. Det er et vigtigt advarselstegn om øget risiko for senere apopleksi.",
  },

  // --- Dissemineret sklerose ---
  {
    topic: "Neurologi",
    question: "Hvad er den grundlæggende patofysiologi ved dissemineret sklerose (MS)?",
    options: [
      "En autoimmun demyelinisering (nedbrydning af myelinskeden) i centralnervesystemet",
      "En blodprop i hjertet",
      "En bakteriel infektion i rygmarven",
      "Tab af dopaminceller i substantia nigra",
    ],
    correct: "A",
    explanation:
      "MS er en autoimmun sygdom, hvor immunforsvaret angriber myelinskeden omkring nervetrådene i CNS, så nerveimpulserne forstyrres.",
  },
  {
    topic: "Neurologi",
    question: "Hvilket forløb er mest typisk for dissemineret sklerose ved sygdomsdebut?",
    options: [
      "Et attakvist (relapsing-remitting) forløb med forværringer (attakker) afløst af bedring",
      "En akut, livstruende tilstand inden for timer",
      "Et fuldstændigt symptomfrit forløb hele livet",
      "Et anfald, der altid kun varer få sekunder",
    ],
    correct: "A",
    explanation:
      "De fleste debuterer med et attakvist forløb (relapsing-remitting): episoder med neurologiske symptomer, der helt eller delvist svinder igen mellem attakkerne.",
  },
  {
    topic: "Neurologi",
    question:
      "En 28-årig kvinde får over få dage nedsat syn på det ene øje med smerter ved øjenbevægelser, og har tidligere haft forbigående føleforstyrrelser i benene. Hvilken sygdom bør man mistænke?",
    options: [
      "Dissemineret sklerose",
      "Parkinsons sygdom",
      "Migræne",
      "Karpaltunnelsyndrom",
    ],
    correct: "A",
    explanation:
      "Synsnervebetændelse (opticusneuritis) hos en ung kvinde sammen med tidligere forbigående neurologiske symptomer fra et andet område er klassisk for MS — symptomer spredt i tid og sted.",
  },

  // --- Neuropatier ---
  {
    topic: "Neurologi",
    question: "Hvad er en meget hyppig årsag til perifer polyneuropati?",
    options: [
      "Diabetes mellitus",
      "Migræne",
      "Forkølelse",
      "Lavt blodtryk",
    ],
    correct: "A",
    explanation:
      "Diabetes er en af de hyppigste årsager til perifer polyneuropati, hvor høje blodsukre over tid skader de perifere nerver.",
  },
  {
    topic: "Neurologi",
    question: "Hvordan præsenterer en perifer polyneuropati sig typisk?",
    options: [
      "Pludselig halvsidig lammelse",
      "Symmetriske føleforstyrrelser, snurren og følelsesløshed, der starter distalt (fødder/hænder) i 'strømpe-handske'-mønster",
      "Anfaldsvis, pulserende hovedpine",
      "Akut nakkestivhed og feber",
    ],
    correct: "B",
    explanation:
      "Perifer polyneuropati giver typisk symmetriske, distale sensoriske symptomer (snurren, prikken, nedsat følesans) i et 'strømpe-handske'-mønster, ofte værst i fødderne.",
  },

  // --- Meningitis / encephalitis ---
  {
    topic: "Neurologi",
    question: "Hvilke symptomer er klassiske for akut bakteriel meningitis?",
    options: [
      "Feber, kraftig hovedpine, nakkestivhed og lysskyhed",
      "Langsomt indsættende hukommelsestab over år",
      "Belastningsudløste smerter i lægmusklen",
      "Anfaldsvis åndenød og hvæsen",
    ],
    correct: "A",
    explanation:
      "Akut bakteriel meningitis giver typisk feber, svær hovedpine, nakkestivhed og lysskyhed. Ved meningokokker kan der tilkomme petekkier (små hudblødninger). Det er en akut, livstruende tilstand.",
  },
  {
    topic: "Neurologi",
    question: "Hvad er encephalitis?",
    options: [
      "En inflammation i selve hjernevævet, ofte forårsaget af virus",
      "En blodprop i benets dybe vener",
      "En forsnævring af luftvejene",
      "En degeneration af dopaminceller",
    ],
    correct: "A",
    explanation:
      "Encephalitis er en betændelse i selve hjernevævet (oftest viral), som ud over feber/hovedpine kan give bevidsthedspåvirkning, adfærdsændringer og kramper. Meningitis er derimod betændelse i hjernehinderne.",
  },

  // --- Hovedpine ---
  {
    topic: "Neurologi",
    question: "Hvad er typisk for en migræne?",
    options: [
      "Bilateral, pressende 'bånd'-fornemmelse uden ledsagesymptomer",
      "Oftest ensidig, pulserende hovedpine ledsaget af kvalme og lys-/lydoverfølsomhed, evt. med forudgående aura",
      "Voldsom ensidig smerte omkring øjet med tåreflåd, i klynger",
      "Pludselig 'eksplosiv' hovedpine, der topper på sekunder",
    ],
    correct: "B",
    explanation:
      "Migræne er typisk ensidig og pulserende, ledsages af kvalme/opkast og lys- og lydoverfølsomhed og forværres ved aktivitet. Nogle har aura (fx synsforstyrrelser) før anfaldet.",
  },
  {
    topic: "Neurologi",
    question: "Hvad kendetegner en spændingshovedpine?",
    options: [
      "Ensidig pulserende smerte med kvalme",
      "Bilateral, pressende eller strammende smerte (som et bånd om hovedet), mild til moderat og uden væsentlig kvalme",
      "Pludselig værste hovedpine i livet",
      "Anfald med tåreflåd og rindende næse",
    ],
    correct: "B",
    explanation:
      "Spændingshovedpine er typisk dobbeltsidig, pressende/strammende ('bånd om hovedet'), af let til moderat intensitet og uden de udtalte ledsagesymptomer, man ser ved migræne.",
  },
  {
    topic: "Neurologi",
    question: "Hvad er karakteristisk for Hortons hovedpine (klyngehovedpine)?",
    options: [
      "Mild, bilateral pressende hovedpine",
      "Voldsom, ensidig smerte omkring/bag øjet med autonome symptomer (tåreflåd, rindende/tilstoppet næse), i anfald der kommer i perioder ('klynger')",
      "Langsomt tiltagende hukommelsestab",
      "Smerter, der kun opstår ved fysisk anstrengelse i benene",
    ],
    correct: "B",
    explanation:
      "Hortons hovedpine giver kortvarige, meget voldsomme ensidige smerter omkring øjet med autonome symptomer på samme side (tåreflåd, næseflåd, ptose). Anfaldene optræder klyngevist.",
  },

  // --- Epilepsi ---
  {
    topic: "Neurologi",
    question: "Hvad er den grundlæggende mekanisme bag et epileptisk anfald?",
    options: [
      "En forbigående afbrydelse af blodforsyningen til hjernen",
      "En abnorm, overdreven og synkron elektrisk aktivitet i hjernens nerveceller",
      "En autoimmun nedbrydning af myelin",
      "En infektion i hjernehinderne",
    ],
    correct: "B",
    explanation:
      "Et epileptisk anfald skyldes pludselig, abnorm og synkron elektrisk udladning i grupper af hjerneceller, hvilket kan give kramper, bevidsthedstab eller andre symptomer.",
  },
  {
    topic: "Neurologi",
    question:
      "En person får et generaliseret krampeanfald. Hvad er den korrekte akutte førstehjælp?",
    options: [
      "Holde fast i personens arme og ben for at stoppe krampen",
      "Lægge noget mellem tænderne for at beskytte tungen",
      "Beskytte personen mod skader, lægge vedkommende i aflåst sideleje når krampen er ovre, og tilkalde hjælp",
      "Påbegynde hjertemassage straks under krampen",
    ],
    correct: "C",
    explanation:
      "Man skal beskytte personen mod tilskadekomst, fjerne farlige genstande, ikke holde fast eller putte noget i munden, og lægge vedkommende i sideleje efter anfaldet. Tilkald hjælp ved langvarigt eller gentaget anfald.",
  },

  // --- Intrakranielle hæmoragier (SAH / SDH / EDH) ---
  {
    topic: "Neurologi",
    question:
      "En patient beskriver en pludselig, eksplosiv hovedpine — 'den værste i mit liv' — der toppede på få sekunder. Hvilken tilstand bør man frem for alt mistænke?",
    options: [
      "Subaraknoidalblødning (SAH)",
      "Spændingshovedpine",
      "Migræne uden aura",
      "Perifer neuropati",
    ],
    correct: "A",
    explanation:
      "Pludselig, eksplosiv 'tordenskraldshovedpine' er klassisk for subaraknoidalblødning, oftest pga. bristning af et aneurisme. Det er en akut, livstruende tilstand.",
  },
  {
    topic: "Neurologi",
    question:
      "Et epiduralt hæmatom (EDH) opstår typisk efter et hovedtraume. Hvad er karakteristisk for forløbet?",
    options: [
      "Et symptomfrit interval ('lucidt interval') efter traumet, efterfulgt af hurtig forværring i takt med at den arterielle blødning vokser",
      "Snigende symptomer over uger uden noget traume",
      "Symptomer der altid forsvinder helt af sig selv",
      "Udelukkende feber og nakkestivhed",
    ],
    correct: "A",
    explanation:
      "EDH skyldes ofte en arteriel blødning (typisk a. meningea media). Klassisk ses et kort 'lucidt interval' med bedring, før patienten hurtigt forværres efterhånden som blødningen vokser.",
  },
  {
    topic: "Neurologi",
    question:
      "Hvilken patientgruppe er særligt udsat for et subduralt hæmatom (SDH), ofte efter et beskedent traume?",
    options: [
      "Ældre og personer med stort alkoholforbrug",
      "Småbørn uden traume",
      "Unge eliteatleter",
      "Personer med migræne",
    ],
    correct: "A",
    explanation:
      "SDH skyldes typisk venøs blødning fra brovener og ses især hos ældre og personer med alkoholoverforbrug (hjerneatrofi strækker venerne). Symptomerne kan udvikle sig snigende over dage til uger.",
  },

  // --- ALS / ataksier ---
  {
    topic: "Neurologi",
    question: "Hvad kendetegner amyotrofisk lateralsklerose (ALS)?",
    options: [
      "Fremadskridende degeneration af de motoriske nerveceller med tiltagende muskelsvækkelse og -svind, mens følesans og kognition typisk er bevaret",
      "En autoimmun demyelinisering med synstab",
      "En akut blodprop i hjernen",
      "En forbigående forvirringstilstand",
    ],
    correct: "A",
    explanation:
      "ALS rammer både øvre og nedre motoriske neuroner, hvilket giver progredierende muskelsvaghed, svind og spasticitet. Følesans og som regel kognition er upåvirket.",
  },
  {
    topic: "Neurologi",
    question: "Hvad er ataksi?",
    options: [
      "En koordinationsforstyrrelse med fx usikker, bredsporet gang og upræcise bevægelser",
      "En anfaldsvis, ensidig hovedpine",
      "En akut infektion i hjernehinderne",
      "En forhøjet muskelkraft",
    ],
    correct: "A",
    explanation:
      "Ataksi er nedsat koordination af bevægelser — ofte pga. lillehjerne- (cerebellar) påvirkning — med usikker gang, balanceproblemer og upræcise (dysmetriske) bevægelser.",
  },

  // --- Myasthenia gravis ---
  {
    topic: "Neurologi",
    question: "Hvad kendetegner myasthenia gravis?",
    options: [
      "Udtrættelig muskelsvaghed pga. antistoffer mod acetylkolinreceptorerne ved den neuromuskulære overgang — fx hængende øjenlåg og dobbeltsyn, værst sidst på dagen",
      "Hviletremor og rigiditet pga. dopaminmangel",
      "Pludselig halvsidig lammelse pga. blodprop",
      "Demyelinisering med attakvise synstab",
    ],
    correct: "A",
    explanation:
      "Myasthenia gravis er autoimmun: antistoffer mod acetylkolinreceptorerne forstyrrer signaloverførslen til musklen. Det giver udtrættelig svaghed, der forværres ved gentagen brug og hen over dagen (ofte ptose og dobbeltsyn).",
  },

  // --- CNS vs PNS ---
  {
    topic: "Neurologi",
    question: "Hvad udgør centralnervesystemet (CNS)?",
    options: [
      "Hjernen og rygmarven",
      "De perifere nerver og nervepletter ude i kroppen",
      "Kun synsnerven",
      "Musklerne og senerne",
    ],
    correct: "A",
    explanation:
      "CNS består af hjernen og rygmarven. Det perifere nervesystem (PNS) omfatter nerverne uden for CNS, der forbinder CNS med kroppens øvrige væv.",
  },
  // ===== PSYKIATRI =====

  // --- Personlighedsforstyrrelser ---
  {
    topic: "Psykiatri",
    question: "Hvad kendetegner en personlighedsforstyrrelse?",
    options: [
      "En forbigående reaktion på en akut belastning",
      "Et gennemgribende og vedvarende mønster i tænkning, følelser og adfærd, der afviger fra det forventede og giver problemer i hverdagen",
      "En infektion i centralnervesystemet",
      "En akut psykotisk tilstand, der går over i løbet af timer",
    ],
    correct: "B",
    explanation:
      "Personlighedsforstyrrelser er dybtliggende, vedvarende og gennemgribende mønstre (ikke episodiske), der typisk viser sig fra ungdommen og giver vanskeligheder i relationer og funktion.",
  },
  {
    topic: "Psykiatri",
    question:
      "Hvad er typisk for emotionelt ustabil personlighedsstruktur (borderline-type)?",
    options: [
      "Stabilt humør og faste, varige relationer",
      "Følelsesmæssig ustabilitet, impulsivitet, ustabile relationer og ofte selvskadende adfærd",
      "Hviletremor og muskelstivhed",
      "Vrangforestillinger og hallucinationer som hovedtræk",
    ],
    correct: "B",
    explanation:
      "Emotionelt ustabil (borderline) personlighedsforstyrrelse præges af affektlabilitet, impulsivitet, ustabilt selvbillede, intense og ustabile relationer samt tendens til selvskade.",
  },
  {
    topic: "Psykiatri",
    question:
      "Hvad adskiller en personlighedsforstyrrelse fra en affektiv lidelse som depression?",
    options: [
      "Personlighedsforstyrrelsen er et vedvarende træk, mens depression typisk optræder i afgrænsede episoder",
      "Der er ingen forskel",
      "Depression er medfødt, mens personlighedsforstyrrelse altid opstår akut",
      "Personlighedsforstyrrelser ses kun hos ældre",
    ],
    correct: "A",
    explanation:
      "En personlighedsforstyrrelse er et stabilt, gennemgribende mønster over tid, mens depression er en episodisk tilstand med en begyndelse og (ofte) en afslutning.",
  },

  // --- Affektive lidelser ---
  {
    topic: "Psykiatri",
    question: "Hvilke tre symptomer regnes som kernesymptomerne ved depression?",
    options: [
      "Nedtrykt stemningsleje, nedsat lyst/interesse og nedsat energi/øget træthed",
      "Feber, hovedpine og nakkestivhed",
      "Hjertebanken, sveden og rysten",
      "Hviletremor, rigiditet og bradykinesi",
    ],
    correct: "A",
    explanation:
      "De tre kernesymptomer er forsænket stemningsleje (nedtrykthed), nedsat lyst og interesse (anhedoni) samt nedsat energi/øget trætbarhed.",
  },
  {
    topic: "Psykiatri",
    question:
      "Ud over kernesymptomerne — hvilket af følgende er et typisk ledsagesymptom ved depression?",
    options: [
      "Forbedret koncentration og højt selvværd",
      "Søvnforstyrrelser, ændret appetit, koncentrationsbesvær og skyldfølelse",
      "Øget energi og nedsat søvnbehov",
      "Hørelseshallucinationer som eneste symptom",
    ],
    correct: "B",
    explanation:
      "Depression ledsages ofte af søvn- og appetitforstyrrelser, koncentrationsbesvær, nedsat selvværd, skyldfølelse og tanker om døden.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad er typisk for en manisk episode?",
    options: [
      "Nedtrykthed og energiløshed",
      "Opstemt eller irritabel stemning, øget aktivitet/energi, nedsat søvnbehov og evt. storhedsidéer og impulsiv adfærd",
      "Nakkestivhed og lysskyhed",
      "Hviletremor og langsomme bevægelser",
    ],
    correct: "B",
    explanation:
      "Mani præges af abnormt løftet eller irritabelt stemningsleje, øget energi og aktivitet, nedsat søvnbehov, taletrang, storhedstanker og impulsiv, ofte risikofyldt adfærd.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad kendetegner bipolar affektiv lidelse?",
    options: [
      "Vedvarende, uændret nedtrykthed hele livet",
      "Vekslen mellem episoder med depression og episoder med mani (eller hypomani)",
      "Udelukkende angstanfald",
      "Kronisk psykose uden stemningsændringer",
    ],
    correct: "B",
    explanation:
      "Bipolar lidelse er karakteriseret ved skiftende episoder af depression og mani/hypomani, ofte med mere normale perioder imellem.",
  },
  {
    topic: "Psykiatri",
    question: "Hvilken vurdering er særligt vigtig hos en patient med svær depression?",
    options: [
      "Vurdering af blodsukker",
      "Vurdering af risikoen for selvmordstanker og selvmord",
      "Måling af lungefunktion",
      "Vurdering af synsstyrke",
    ],
    correct: "B",
    explanation:
      "Selvmordsrisiko er en central del af vurderingen ved depression, da svær depression er forbundet med øget risiko. Det er vigtigt at spørge åbent og roligt ind til tanker om at dø eller om at gøre skade på sig selv.",
  },
  {
    topic: "Psykiatri",
    question:
      "Hvad er ofte førstevalg i den medicinske behandling af moderat til svær depression?",
    options: [
      "Antibiotika",
      "SSRI (selektive serotonin-genoptagshæmmere)",
      "Insulin",
      "Betablokkere",
    ],
    correct: "B",
    explanation:
      "SSRI er ofte førstevalg ved medicinsk behandling af depression, gerne kombineret med psykoterapi. Dette uddybes i farmakologi-delen.",
  },

  // --- Angstlidelser ---
  {
    topic: "Psykiatri",
    question: "Hvad kendetegner generaliseret angst (GAD)?",
    options: [
      "Pludselige, kortvarige angstanfald, der topper på minutter",
      "Vedvarende, overdreven og svært kontrollerbar bekymring om mange dagligdags forhold gennem længere tid",
      "Genoplevelser af en traumatisk hændelse",
      "Tvangshandlinger",
    ],
    correct: "B",
    explanation:
      "GAD præges af vedvarende, generaliseret og overdreven bekymring (typisk mindst 6 måneder) ledsaget af bl.a. rastløshed, anspændthed, koncentrationsbesvær og søvnproblemer.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad kendetegner et panikanfald?",
    options: [
      "En langsomt indsættende nedtrykthed over uger",
      "Et pludseligt anfald af intens angst med kraftige fysiske symptomer (hjertebanken, åndenød, sveden, svimmelhed), der topper inden for få minutter",
      "Vedvarende tvangstanker",
      "Hørelseshallucinationer",
    ],
    correct: "B",
    explanation:
      "Panikanfald kommer pludseligt, topper hurtigt (typisk inden for minutter) og ledsages af udtalte kropslige symptomer samt ofte dødsangst eller frygt for at miste kontrollen.",
  },
  {
    topic: "Psykiatri",
    question:
      "En 30-årig kommer akut med hjertebanken, åndenød, brystubehag og en stærk følelse af at skulle dø. Symptomerne toppede på få minutter og klinger nu af, og hjerteundersøgelser er normale. Hvad kan forklare anfaldet, når alvorlig fysisk sygdom er udelukket?",
    options: [
      "Et panikanfald",
      "En akut blodprop i lungen",
      "Et epileptisk anfald",
      "En migræne",
    ],
    correct: "A",
    explanation:
      "Når akut hjerte-/lungesygdom er udelukket, kan et anfald med pludselig intens angst og kraftige kropslige symptomer, der topper hurtigt, være et panikanfald. Man skal dog altid først udelukke somatiske årsager.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad er centrale symptomer ved PTSD (posttraumatisk belastningsreaktion)?",
    options: [
      "Tvangstanker og tvangshandlinger",
      "Genoplevelser (flashbacks/mareridt) af en traumatisk hændelse, undgåelse af det, der minder om den, samt øget vagtsomhed (hyperarousal)",
      "Opstemthed og nedsat søvnbehov",
      "Hviletremor og rigiditet",
    ],
    correct: "B",
    explanation:
      "PTSD opstår efter en alvorlig traumatisk hændelse og præges af påtrængende genoplevelser, undgåelsesadfærd, negativ stemning og forhøjet alarmberedskab (hyperarousal).",
  },
  {
    topic: "Psykiatri",
    question: "Hvad består OCD (obsessiv-kompulsiv tilstand) af?",
    options: [
      "Tvangstanker (obsessioner) og tvangshandlinger (kompulsioner)",
      "Genoplevelser af et traume",
      "Opstemthed og storhedstanker",
      "Vrangforestillinger og hallucinationer",
    ],
    correct: "A",
    explanation:
      "OCD består af tvangstanker (påtrængende, uønskede tanker, der skaber angst) og tvangshandlinger (gentagne handlinger eller ritualer, der udføres for at dæmpe angsten).",
  },
  {
    topic: "Psykiatri",
    question:
      "Hvorfor udfører en person med OCD gentagne tvangshandlinger (fx hyppig håndvask)?",
    options: [
      "For at opnå nydelse",
      "For midlertidigt at dæmpe den angst og det ubehag, som tvangstankerne fremkalder",
      "For at træne musklerne",
      "Fordi de hører stemmer, der befaler det",
    ],
    correct: "B",
    explanation:
      "Tvangshandlinger reducerer kortvarigt den angst, tvangstankerne udløser. Lettelsen er dog midlertidig, og mønsteret forstærker sig selv over tid.",
  },
  {
    topic: "Psykiatri",
    question: "Hvilken af følgende er IKKE en angstlidelse?",
    options: [
      "Generaliseret angst (GAD)",
      "Panikangst",
      "OCD",
      "Skizofreni",
    ],
    correct: "D",
    explanation:
      "Skizofreni er en psykotisk lidelse, ikke en angstlidelse. GAD, panikangst og OCD hører til angstspektret.",
  },

  // --- Psykose / skizofreni ---
  {
    topic: "Psykiatri",
    question: "Hvad kendetegner en psykose?",
    options: [
      "Bevaret realitetssans men nedtrykt humør",
      "En tilstand med svigtende realitetstestning, fx vrangforestillinger og/eller hallucinationer",
      "En forbigående muskelsvaghed",
      "En akut infektion i hjernehinderne",
    ],
    correct: "B",
    explanation:
      "Psykose indebærer en forstyrret realitetstestning, hvor personen oplever vrangforestillinger og/eller hallucinationer og kan have svært ved at skelne det indre fra den ydre virkelighed.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad er en hallucination?",
    options: [
      "En fast, fejlagtig overbevisning",
      "En sanseoplevelse uden et ydre stimulus — fx at høre eller se noget, der ikke er der",
      "En forbigående hukommelsessvækkelse",
      "En kraftig hovedpine",
    ],
    correct: "B",
    explanation:
      "En hallucination er en sanseoplevelse uden tilsvarende ydre stimulus. Ved skizofreni er hørelseshallucinationer (stemmer) de hyppigste.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad er en vrangforestilling (delusion)?",
    options: [
      "En sanseoplevelse uden ydre stimulus",
      "En fast, urokkelig overbevisning, der ikke svarer til virkeligheden, og som ikke kan korrigeres med argumenter",
      "En normal bekymring",
      "Et fysisk symptom fra hjertet",
    ],
    correct: "B",
    explanation:
      "En vrangforestilling er en fastlåst, fejlagtig overbevisning, som personen fastholder trods modbeviser, og som ikke deles af den kulturelle baggrund.",
  },
  {
    topic: "Psykiatri",
    question: "Hvilket af følgende er et NEGATIVT symptom ved skizofreni?",
    options: [
      "Hørelseshallucinationer",
      "Vrangforestillinger",
      "Affektaffladning, initiativløshed og social tilbagetrækning",
      "Tankeforstyrrelser med usammenhængende tale",
    ],
    correct: "C",
    explanation:
      "Positive symptomer er noget, der 'kommer til' (hallucinationer, vrangforestillinger). Negative symptomer er noget, der 'mangler' — fx følelsesmæssig affladning, manglende initiativ og social tilbagetrækning.",
  },

  // --- Spiseforstyrrelser ---
  {
    topic: "Psykiatri",
    question: "Hvad kendetegner anorexia nervosa?",
    options: [
      "Tilbagevendende overspisning uden kompenserende adfærd",
      "Bevidst lav kropsvægt, intens frygt for vægtøgning og en forstyrret oplevelse af egen krop",
      "Vekslende episoder af mani og depression",
      "Pludselige panikanfald",
    ],
    correct: "B",
    explanation:
      "Anorexia nervosa præges af betydeligt undervægt, en intens frygt for at tage på samt en forstyrret krops- og selvopfattelse.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad kendetegner bulimia nervosa?",
    options: [
      "Vedvarende meget lav kropsvægt",
      "Episoder med overspisning efterfulgt af kompenserende adfærd (fx selvfremkaldt opkastning eller misbrug af afføringsmidler), ofte ved normal vægt",
      "Manglende interesse for mad uden andre symptomer",
      "Tvangstanker om smitte",
    ],
    correct: "B",
    explanation:
      "Bulimi er karakteriseret ved gentagne overspisningsepisoder med tab af kontrol, efterfulgt af kompenserende adfærd. Vægten er ofte inden for normalområdet.",
  },
  {
    topic: "Psykiatri",
    question: "Hvilke somatiske komplikationer kan ses ved svær anoreksi?",
    options: [
      "Forhøjet kropsvægt og forhøjet blodtryk",
      "Elektrolytforstyrrelser, langsom puls (bradykardi), udeblivende menstruation og knogleskørhed",
      "Forbedret knoglestyrke",
      "Ingen fysiske konsekvenser overhovedet",
    ],
    correct: "B",
    explanation:
      "Svær underernæring kan give bl.a. elektrolytforstyrrelser (med risiko for hjertepåvirkning), bradykardi, hormonforstyrrelser med amenoré og nedsat knoglemineralisering (osteoporose). Det gør anoreksi til en alvorlig somatisk tilstand.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad kendetegner binge eating disorder (tvangsoverspisning)?",
    options: [
      "Gentagne episoder med overspisning og tab af kontrol UDEN regelmæssig kompenserende adfærd",
      "Vedvarende meget lav vægt",
      "Selvfremkaldt opkastning efter hvert måltid",
      "Manglende sult og fuldstændig madafvisning",
    ],
    correct: "A",
    explanation:
      "Binge eating disorder er gentagne overspisningsepisoder med kontroltab, men uden den regelmæssige kompenserende adfærd (opkastning, faste, overdreven motion), man ser ved bulimi.",
  },

  // --- Demens ---
  {
    topic: "Psykiatri",
    question:
      "Hos en ældre patient kan svær depression nogle gange ligne demens, med dårlig hukommelse og koncentration. Hvad kaldes dette fænomen?",
    options: ["Pseudodemens", "Delir", "Mani", "Psykose"],
    correct: "A",
    explanation:
      "Depression hos ældre kan give kognitive symptomer, der minder om demens (pseudodemens). Det er vigtigt at skelne, fordi depressionen kan behandles og symptomerne dermed bedres.",
  },
  {
    topic: "Psykiatri",
    question:
      "Demens ledsages ofte af adfærdsmæssige og psykologiske symptomer (BPSD). Hvilket er et eksempel herpå?",
    options: [
      "Forbedret hukommelse",
      "Uro, vrangforestillinger, aggression eller apati",
      "Øget muskelstyrke",
      "Anfaldsvis hovedpine",
    ],
    correct: "B",
    explanation:
      "Ud over de kognitive symptomer ses ofte adfærdsmæssige og psykologiske symptomer (BPSD) som uro, angst, depression, vrangforestillinger, aggression eller apati.",
  },

  // --- Stress ---
  {
    topic: "Psykiatri",
    question: "Hvad sker der i kroppen ved en akut stressreaktion ('kamp-flugt')?",
    options: [
      "Frigivelse af stresshormoner som adrenalin og kortisol med øget puls, blodtryk og årvågenhed",
      "Et fald i puls og blodtryk samt dyb afslapning",
      "En akut allergisk reaktion",
      "Tab af følesans i fødderne",
    ],
    correct: "A",
    explanation:
      "Den akutte stressrespons aktiverer det sympatiske nervesystem og frigiver adrenalin og kortisol, hvilket bl.a. øger puls, blodtryk, blodsukker og årvågenhed — kroppen gøres klar til kamp eller flugt.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad kan langvarig (kronisk) stress føre til?",
    options: [
      "Ingen helbredsmæssige konsekvenser",
      "Fysiske og psykiske symptomer som træthed, søvnproblemer, koncentrationsbesvær og øget risiko for sygdom",
      "Permanent forbedret immunforsvar",
      "Øget muskelmasse",
    ],
    correct: "B",
    explanation:
      "Vedvarende stress kan give både kropslige og psykiske symptomer (træthed, søvn- og koncentrationsproblemer, hovedpine, irritabilitet) og over tid øge risikoen for bl.a. hjerte-kar-sygdom, angst og depression.",
  },

  // --- Delir ---
  {
    topic: "Psykiatri",
    question:
      "Delir kan inddeles i en hyperaktiv og en hypoaktiv form. Hvad kendetegner den hypoaktive form, som ofte overses?",
    options: [
      "Udtalt motorisk uro og aggression",
      "Sløvhed, tilbagetrækning og nedsat aktivitet",
      "Opstemthed og storhedstanker",
      "Pludselige panikanfald",
    ],
    correct: "B",
    explanation:
      "Hypoaktivt delir viser sig ved sløvhed, stilhed og tilbagetrækning og overses let, fordi patienten ikke er urolig. Det er dog lige så alvorligt som den hyperaktive form.",
  },
  {
    topic: "Psykiatri",
    question: "Hvad er det vigtigste i behandlingen af delir?",
    options: [
      "At finde og behandle den udløsende årsag (fx infektion, dehydrering, smerter eller medicin)",
      "At ignorere tilstanden, da den altid går over af sig selv",
      "Udelukkende at give beroligende medicin",
      "At udskrive patienten hurtigst muligt",
    ],
    correct: "A",
    explanation:
      "Delir er som regel udløst af en bagvedliggende årsag. Den vigtigste behandling er at finde og behandle årsagen samt sørge for ro, orientering og et trygt miljø.",
  },
  // ---- Add your real questions below this line ----
];

/* ============================================================================
   Below is the quiz engine. You normally don't need to touch anything here —
   just edit the QUESTIONS list above.
   ============================================================================ */

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const ALL = "__ALLE_EMNER__";

function topicOf(q) {
  return q.topic && String(q.topic).trim() ? String(q.topic).trim() : "Andet";
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  // Build the list of topics (name + count), in first-seen order.
  const topics = useMemo(() => {
    const map = new Map();
    QUESTIONS.forEach((q) => {
      const t = topicOf(q);
      map.set(t, (map.get(t) || 0) + 1);
    });
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, []);

  const [screen, setScreen] = useState("menu"); // "menu" | "quiz" | "summary"
  const [shuffleOn, setShuffleOn] = useState(false);
  const [activeTopic, setActiveTopic] = useState(ALL);
  const [deck, setDeck] = useState([]);
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  const total = deck.length;
  const q = total > 0 && pos < total ? deck[pos] : null;
  const correctIndex = q
    ? LETTERS.indexOf(String(q.correct).trim().toUpperCase())
    : -1;
  const malformed =
    q && (correctIndex < 0 || correctIndex >= (q.options?.length ?? 0));
  const answered = selected !== null;

  const buildDeck = useCallback((topic, doShuffle) => {
    const filtered =
      topic === ALL ? QUESTIONS : QUESTIONS.filter((x) => topicOf(x) === topic);
    return doShuffle ? shuffle(filtered) : [...filtered];
  }, []);

  const startTopic = useCallback(
    (topic, doShuffle) => {
      setActiveTopic(topic);
      setDeck(buildDeck(topic, doShuffle));
      setPos(0);
      setSelected(null);
      setScore({ correct: 0, wrong: 0 });
      setScreen("quiz");
    },
    [buildDeck]
  );

  const handleAnswer = useCallback(
    (i) => {
      if (answered || malformed) return;
      setSelected(i);
      setScore((s) =>
        i === correctIndex
          ? { ...s, correct: s.correct + 1 }
          : { ...s, wrong: s.wrong + 1 }
      );
    },
    [answered, malformed, correctIndex]
  );

  const next = useCallback(() => {
    if (!answered) return;
    if (pos + 1 >= total) {
      setScreen("summary");
    } else {
      setPos((p) => p + 1);
      setSelected(null);
    }
  }, [answered, pos, total]);

  // Keyboard: number/letter to answer, Enter/→ for next.
  useEffect(() => {
    if (screen !== "quiz") return;
    function onKey(e) {
      if (!q) return;
      if (!answered) {
        const n = parseInt(e.key, 10);
        if (!Number.isNaN(n) && n >= 1 && n <= q.options.length) {
          handleAnswer(n - 1);
          return;
        }
        const li = LETTERS.indexOf(e.key.toUpperCase());
        if (li >= 0 && li < q.options.length) handleAnswer(li);
      } else if (e.key === "Enter" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, q, answered, handleAnswer, next]);

  const topicLabel = activeTopic === ALL ? "Alle emner" : activeTopic;

  // ---------- Empty state ----------
  if (QUESTIONS.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-xl font-semibold text-slate-800 mb-2">
            Ingen spørgsmål endnu
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Tilføj spørgsmål i <span className="font-mono">QUESTIONS</span>-listen
            øverst i koden, så dukker de op her.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Menu screen ----------
  if (screen === "menu") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-xl">
          <header className="mb-6 pt-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Patologi &amp; Farmakologi
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Vælg et emne at træne.
            </p>
          </header>

          <label className="mb-4 flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={shuffleOn}
              onChange={(e) => setShuffleOn(e.target.checked)}
              className="h-4 w-4 accent-teal-700"
            />
            Bland spørgsmålenes rækkefølge
          </label>

          {/* All topics */}
          <button
            onClick={() => startTopic(ALL, shuffleOn)}
            className="w-full mb-3 flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4 text-left hover:bg-teal-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <span>
              <span className="block font-semibold text-teal-900">
                Alle emner
              </span>
              <span className="block text-xs text-teal-700 mt-0.5">
                Alle {QUESTIONS.length} spørgsmål blandet sammen
              </span>
            </span>
            <span className="text-teal-700 text-xl" aria-hidden>
              →
            </span>
          </button>

          {/* Topic list */}
          <div className="flex flex-col gap-2">
            {topics.map((t) => (
              <button
                key={t.name}
                onClick={() => startTopic(t.name, shuffleOn)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-left hover:border-teal-400 hover:bg-teal-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span className="font-medium text-slate-800">{t.name}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {t.count} {t.count === 1 ? "spørgsmål" : "spørgsmål"}
                  </span>
                  <span className="text-slate-300" aria-hidden>
                    →
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Summary screen ----------
  if (screen === "summary") {
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    const radius = 52;
    const circ = 2 * Math.PI * radius;
    const dash = (pct / 100) * circ;
    const message =
      pct >= 80
        ? "Flot! Du er godt klædt på."
        : pct >= 50
        ? "Godt på vej — kør en runde til."
        : "Bare rolig — repetition gør mester. Prøv igen.";

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700 mb-1">
            Resultat
          </p>
          <p className="text-xs text-slate-400 mb-6">{topicLabel}</p>

          <div className="flex justify-center mb-6">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#0d9488"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="70" textAnchor="middle" dominantBaseline="central" fontSize="30" fontWeight="700" fill="#1e293b">
                {pct}%
              </text>
            </svg>
          </div>

          <p className="text-slate-800 text-lg font-medium mb-1">
            {score.correct} af {total} rigtige
          </p>
          <p className="text-slate-500 text-sm mb-8">{message}</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => startTopic(activeTopic, shuffleOn)}
              className="w-full rounded-xl bg-teal-700 px-4 py-3 text-white font-medium hover:bg-teal-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Tag samme emne igen
            </button>
            <button
              onClick={() => setScreen("menu")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 font-medium hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Vælg andet emne
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Quiz screen ----------
  const progressPct = ((pos + (answered ? 1 : 0)) / total) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <header className="mb-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              onClick={() => setScreen("menu")}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
            >
              <span aria-hidden>←</span> {topicLabel}
            </button>
            <div className="flex items-center gap-3 text-sm shrink-0">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {score.correct}
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-rose-600">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                {score.wrong}
              </span>
            </div>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-teal-600 transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="mt-2 block text-xs text-slate-500">
            Spørgsmål {pos + 1} af {total}
          </span>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          {malformed ? (
            <p className="text-rose-600 text-sm">
              Dette spørgsmål er sat forkert op: det rigtige svar ("
              {String(q.correct)}") passer ikke til svarmulighederne. Tjek{" "}
              <span className="font-mono">correct</span> for dette spørgsmål i koden.
            </p>
          ) : (
            <>
              <h2 className="text-lg sm:text-xl font-medium text-slate-800 leading-snug mb-5">
                {q.question}
              </h2>

              <div className="flex flex-col gap-2.5">
                {q.options.map((opt, i) => {
                  const isCorrect = i === correctIndex;
                  const isPicked = i === selected;

                  let cls = "border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50";
                  if (answered) {
                    if (isCorrect) cls = "border-emerald-500 bg-emerald-50";
                    else if (isPicked) cls = "border-rose-400 bg-rose-50";
                    else cls = "border-slate-200 bg-white opacity-60";
                  }

                  let badgeCls = "bg-slate-100 text-slate-500";
                  if (answered && isCorrect) badgeCls = "bg-emerald-500 text-white";
                  else if (answered && isPicked) badgeCls = "bg-rose-500 text-white";

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={answered}
                      className={`flex items-start gap-3 w-full text-left rounded-xl border px-4 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${cls} ${
                        answered ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${badgeCls}`}>
                        {LETTERS[i]}
                      </span>
                      <span className="text-slate-800 text-sm sm:text-base leading-snug">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-5" aria-live="polite">
                  <p className={`text-sm font-semibold mb-1 ${selected === correctIndex ? "text-emerald-700" : "text-rose-600"}`}>
                    {selected === correctIndex ? "Rigtigt!" : "Forkert"}
                  </p>
                  {q.explanation && (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {q.explanation}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {answered ? "Tryk Enter for næste" : "Vælg et svar"}
            </span>
            <button
              onClick={next}
              disabled={!answered}
              className="rounded-xl bg-teal-700 px-5 py-2.5 text-white text-sm font-medium hover:bg-teal-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {pos + 1 >= total ? "Se resultat" : "Næste"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
