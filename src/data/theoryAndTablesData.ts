export interface TheoryChapter {
  id: string;
  numero: string;
  titolo: string;
  sottotitolo: string;
  moduloCollegato?: string;
  paragrafi: {
    codice: string;
    titolo: string;
    contenuto: string[];
    esempi: { russo: string; italiano: string; nota: string }[];
  }[];
}

export interface SynopticRowGeneral {
  contesto: string;
  regola: string;
  esempio: string;
  valore: string;
  aspetto: 'НСВ' | 'СВ' | 'НСВ / СВ';
}

export interface SuffixPairRow {
  modello: string;
  strutturaCB: string;
  esempi: string;
  note: string;
}

export interface SuppletiveRow {
  nsv: string;
  sv: string;
  traduzione: string;
  note: string;
}

export interface AktionsartRow {
  modo: string;
  prefisso: string;
  significato: string;
  esempi: string;
}

export const methodologicalIntro = {
  autore: "L.G. Abu Lafia",
  titolo: "L'aspetto verbale russo — Teoria ed esercizi per studenti italiani",
  dedica: "Al professor Aldo Cantarini e alla professoressa Olga Simcic, in ricordo dei lunghi pomeriggi passati nelle aule di Palazzo Meoni",
  sezioni: [
    {
      titolo: "Una rivoluzione cognitiva per l'italofono",
      testo: "Ogni studente di russo, prima o poi, si scontra con l'aspetto verbale (категория глагольного вида). È il momento in cui la grammatica smette di essere una questione di forme da memorizzare e diventa un modo diverso di guardare le azioni: non più quando accade qualcosa, ma come la si vede, se nel suo svolgersi lineare (НСВ) o nel suo compiersi entro un limite (СВ)."
    },
    {
      titolo: "Una scelta controcorrente: la soluzione subito dopo la domanda (Design DSA)",
      testo: "Questa impostazione nasce dall'attenzione verso gli studenti dislessici, per i quali il salto continuo tra esercizio e correzione in fondo al volume può essere faticoso e disorientante. Basta un semplice foglio per coprire di volta in volta la risposta: si legge la domanda, si ragiona, si prova, e solo allora si scopre la soluzione. Il controllo è istantaneo e l'errore viene corretto nel momento esatto in cui si produce, quando la memoria è più ricettiva."
    },
    {
      titolo: "La ripetizione come metodo e automatismo",
      testo: "L'aspetto verbale si impara come si impara ad andare in bicicletta, ripetendo il gesto finché smette di richiedere sforzo. Le formule ricorrenti servono a far emergere lo schema, a trasformare la regola in riflesso, fino a che la scelta tra imperfettivo e perfettivo arriva come un'intuizione naturale: smettere di applicare la regola e cominciare a sentire la lingua."
    }
  ]
};

export const theoryChapters: TheoryChapter[] = [
  {
    id: "cap-1",
    numero: "Capitolo I",
    titolo: "Morfologia Verbale e Formazione delle Coppie Aspettuali",
    sottotitolo: "Coppia aspettuale, prefissazione vuota e lessicale, prefisso на-, suffissazione secondaria, apofonia e suppletivismo",
    moduloCollegato: "MODULO 1 — VERBI DI FASE E COMPLEMENTI TEMPORALI DELL'ASPETTO",
    paragrafi: [
      {
        codice: "1.1 – 1.2",
        titolo: "La Coppia Aspettuale (Видовая Пара) e la Prefissazione",
        contenuto: [
          "La coppia aspettuale richiede l'assoluta identità di significato lessicale unita a un'opposizione pura di significato grammaticale: prospettiva processuale (НСВ, durata o flusso dell'attività) contro prospettiva risultativa (СВ, totalità e conclusione dell'atto).",
          "I prefissi puramente aspettuali o «vuoti» (с-, на-, про-, вы-, по-, за-) non alterano la semantica di base ma impongono il sigillo della compiutezza. La prefissazione lessicale (es. переписать = ricopiare) modifica invece il significato e richiede un imperfettivo secondario suffissato (переписывать)."
        ],
        esempi: [
          { russo: "Я долго читал эту книгу.", italiano: "Ho letto / stavo leggendo questo libro a lungo.", nota: "НСВ: processo duraturo" },
          { russo: "Я прочитал эту книгу за два дня.", italiano: "Ho terminato questo libro in due giorni.", nota: "СВ: risultato entro за + acc." },
          { russo: "Студент переписал конспекты за час.", italiano: "Lo studente ha ricopiato gli appunti in un'ora.", nota: "СВ lessicale → НСВ переписывать" }
        ]
      },
      {
        codice: "1.3",
        titolo: "I Verbi Derivati con il Prefisso на- e la Quantificazione Parziale",
        contenuto: [
          "I verbi perfettivi formati con il prefisso cumulativo на- esprimono il raggiungimento di una certa quantità accumulata o parziale rispetto a una totalità potenziale, reggendo regolarmente il genitivo partitivo (дров, пирогов, воды, грибов).",
          "Si oppongono nettamente ai verbi che indicano l'esaurimento integrale della materia prima (che reggono l'accusativo diretto con весь/всю)."
        ],
        esempi: [
          { russo: "Он пошёл в лес и нарубил дров для камина.", italiano: "È andato nel bosco e ha tagliato una certa quantità di legna.", nota: "Prefisso на- + Genitivo partitivo" },
          { russo: "Бабушка напекла вкусных пирогов к чаю.", italiano: "La nonna ha cotto una buona quantità di pasticcetti per il tè.", nota: "Quantificazione parziale/cumulativa" }
        ]
      },
      {
        codice: "1.4 – 1.6",
        titolo: "Suffissazione Secondaria, Apofonia, Suppletivismo e Bi-aspettualità",
        contenuto: [
          "La suffissazione imperfettivizzante secondaria opera tramite tre moduli regolari: 1) -ыва-/-ива- (con frequente alternanza о → а sotto accento, es. опоздать → опаздывать); 2) -ва- dopo radici vocaliche o monosillabiche (дать → давать, открыть → открывать); 3) sostituzione vocalica -и-/-е- → -а-/-я- con palatalizzazione consonantica (ответить → отвечать, исправить → исправлять).",
          "Il suppletivismo radicale oppone radici etimologicamente distinte (брать/взять, говорить/сказать, класть/положить, садиться/сесть, ложиться/лечь). I verbi bi-aspettuali (использовать, исследовать, организовать/организовывать) chiariscono il proprio valore attraverso il contesto."
        ],
        esempi: [
          { russo: "Каждый день директор открывал офис в девять часов.", italiano: "Ogni giorno il direttore apriva l'ufficio alle nove.", nota: "НСВ suffissato in -ва- (abitudine)" },
          { russo: "Студент взял нужную книгу со стола.", italiano: "Lo studente ha preso il libro necessario dal tavolo.", nota: "СВ suppletivo (брать / взять)" }
        ]
      }
    ]
  },
  {
    id: "cap-2",
    numero: "Capitolo II",
    titolo: "Semantica e Pragmatica dell'Aspetto nei Tempi dell'Indicativo",
    sottotitolo: "Durata vs. risultato, delimitativi in по- vs. perdurativi in про-, iteratività, fatto generico e annullamento del risultato",
    moduloCollegato: "MODULO 3 — ANNULLAMENTO DEL RISULTATO VS. STATO CONSERVATO",
    paragrafi: [
      {
        codice: "2.1",
        titolo: "Processo e Durata (НСВ) vs. Risultato (СВ), Delimitativi e Perdurativi",
        contenuto: [
          "Al passato, l'imperfettivo (НСВ) esprime lo svolgimento illimitato e si combina con долго, весь день, всю неделю, часами. Il perfettivo (СВ) focalizza il risultato conseguito e si combina con за + accusativo (за два часа), наконец, сразу.",
          "I verbi delimitativi con prefisso по- (поработать, почитать) isolano un breve frammento temporale («per un po'»), mentre i perdurativi con про- (просидеть весь вечер) sottolineano la totale compenetrazione di uno stato persistente lungo un intervallo definito."
        ],
        esempi: [
          { russo: "Студент целый день писал доклад.", italiano: "Lo studente è stato a scrivere la relazione per tutto il giorno.", nota: "НСВ: durata continuativa" },
          { russo: "Студент за два часа написал этот сложный доклад.", italiano: "Lo studente ha scritto questa relazione complessa in due ore.", nota: "СВ: tempo completivo con за" }
        ]
      },
      {
        codice: "2.2 – 2.3",
        titolo: "Iteratività, Fatto Generico (когда-нибудь) e Risultato Annullato vs. Conservato",
        contenuto: [
          "L'НСВ al passato assolve a tre funzioni secondarie cruciali: 1) Iteratività e abitualità (обычно, часто, каждый день, всегда, редко); 2) Constatazione del fatto generico / esperienza esistenziale (Вы когда-нибудь читали...); 3) Risultato annullato (azione a doppio senso o di andata e ritorno il cui esito è stato revocato nel presente).",
          "Il СВ al passato esprime invece il valore perfetto (перфектное значение: l'effetto permane tangibile nel presente) oppure la progressione narrativa di eventi compiuti in sequenza (СВ + СВ)."
        ],
        esempi: [
          { russo: "К нам приходил врач, но он уже ушёл.", italiano: "Da noi è venuto il medico, ma è già andato via.", nota: "НСВ: risultato annullato (andata e ritorno)" },
          { russo: "Вы открыли окно, поэтому в комнате сквозняк.", italiano: "Avete aperto la finestra, perciò nella stanza c'è corrente.", nota: "СВ: valore perfetto (finestra tuttora aperta)" }
        ]
      }
    ]
  },
  {
    id: "cap-3",
    numero: "Capitolo III",
    titolo: "L'Aspetto nelle Costruzioni Modali, con l'Infinito e nell'Imperativo",
    sottotitolo: "Verbi di fase, нельзя, sconsiglio (не надо / не стоит / зачем), dativo + не + infinito e pragmatica dell'imperativo",
    moduloCollegato: "MODULO 5 — COSTRUZIONI MODALI E NEGAZIONE CON L'INFINITO",
    paragrafi: [
      {
        codice: "3.1 – 3.2",
        titolo: "Verbi di Fase, Costruzioni con нельзя ed Espressioni di Inutilità",
        contenuto: [
          "I verbi di fase (начать, стать, продолжать, кончить, закончить, перестать, прекратить) reggono obbligatoriamente ed esclusivamente l'infinito imperfettivo (НСВ).",
          "Con нельзя: нельзя + НСВ esprime un divieto generale, normativo o deontico («è vietato»); нельзя + СВ esprime un'impossibilità fisica, tecnica o contingente («è impossibile compiere l'atto»). Le espressioni di sconsiglio e inutilità (не надо, не нужно, не стоит, не следует, зачем) reggono tassativamente l'infinito НСВ."
        ],
        esempi: [
          { russo: "Здесь нельзя входить без специального пропуска.", italiano: "Qui è vietato entrare senza un permesso speciale.", nota: "нельзя + НСВ = divieto normativo" },
          { russo: "Дверь заперта, сюда нельзя войти.", italiano: "La porta è chiusa a chiave, qui è impossibile entrare.", nota: "нельзя + СВ = impossibilità materiale" }
        ]
      },
      {
        codice: "3.3",
        titolo: "Costruzioni Impersonali al Dativo (Dativo + не + Infinito)",
        contenuto: [
          "La struttura Dativo + не + Infinito СВ esprime un'impossibilità oggettiva o un'incapacità insormontabile di portare a termine il compito (Мне не решить эту задачу = Non riuscirò a risolvere questo problema).",
          "La struttura Dativo + не + Infinito НСВ veicola invece il senso pragmatico di non spettanza o estraneità al compito (Не мне решать эту задачу = Non spetta a me decidere/risolvere questo problema)."
        ],
        esempi: [
          { russo: "Ему не защитить диссертацию.", italiano: "Non riuscirà a difendere la tesi (impossibilità oggettiva).", nota: "Dativo + не + СВ" },
          { russo: "Не ему защищать диссертацию.", italiano: "Non sta a lui / non spetta a lui difendere la tesi.", nota: "Dativo + не + НСВ (non spettanza)" }
        ]
      },
      {
        codice: "3.4",
        titolo: "Pragmatica e Sintassi del Modo Imperativo",
        contenuto: [
          "Nell'imperativo affermativo: il СВ formula richieste puntuali, ordini specifici o compiti con scadenza; l'НСВ formula inviti cortesi di ospitalità (Проходите, садитесь, пейте чай) o sollecitazioni a proseguire un'attività.",
          "Nell'imperativo negativo: не + НСВ esprime un divieto deliberato e categorico; (смотри) не + СВ esprime un avvertimento urgente contro un pericolo accidentale o involontario (Смотри не упади!). Infine, l'imperativo НСВ (con o senza не) risponde a una minaccia o a un rifiuto esprimendo sfida e totale indifferenza (— Я скажу начальнику! — Говорите!)."
        ],
        esempi: [
          { russo: "Смотри, не упади на скользком льду!", italiano: "Bada di non cadere sul ghiaccio scivoloso!", nota: "смотри не + СВ = avvertimento contro incidente" },
          { russo: "— Не приглашу тебя! — Не приглашай!", italiano: "— Non ti inviterò! — Non invitarmi pure (non mi importa)!", nota: "НСВ = indifferenza a minaccia/rifiuto" }
        ]
      }
    ]
  },
  {
    id: "cap-4",
    numero: "Capitolo IV",
    titolo: "Sintassi del Periodo, Nomi d'Azione e Forme Nominali del Verbo",
    sottotitolo: "Subordinate temporali (пока, за то время пока), condizionali (если), finali (чтобы), participi, gerundi e sostantivi reggenti l'infinito",
    moduloCollegato: "MODULO 8 — RELAZIONI TEMPORALI TRA FRASI",
    paragrafi: [
      {
        codice: "4.1",
        titolo: "Subordinate Temporali, Condizionali (если) e Finali (чтобы)",
        contenuto: [
          "Nelle temporali: simultaneità di processi paralleli (Пока + НСВ ... НСВ); successione lineare di eventi (Когда + СВ ... СВ); compimento entro una cornice duratura con За то время, пока + НСВ (sfondo), + СВ (risultato raggiunto nella reggente).",
          "Nelle condizionali reali al futuro (если + futuro): si usa il futuro composto НСВ per condizioni abituali o continuative, e il futuro semplice СВ per condizioni puntuali e concluse. Nelle finali con чтобы: prevale il СВ per scopi mirati a un singolo risultato o per prevenire un incidente (чтобы не + СВ), mentre si usa l'НСВ per attività di studio continuative o stati duraturi."
        ],
        esempi: [
          { russo: "За то время, пока учёные работали в архиве, профессор подготовил доклад.", italiano: "Nel tempo in cui gli scienziati lavoravano in archivio (НСВ), il professore ha preparato la relazione (СВ).", nota: "Cornice duratura НСВ + esito СВ" },
          { russo: "Если ты прочитаешь эту книгу, ты поймёшь сюжет.", italiano: "Se leggerai questo libro, capirai la trama.", nota: "СВ + СВ nel periodo ipotetico" }
        ]
      },
      {
        codice: "4.2 – 4.4",
        titolo: "Participi, Gerundi e Nomi d'Azione Reggenti l'Infinito",
        contenuto: [
          "I participi presenti (читающий, читаемый) derivano esclusivamente da verbi НСВ. Il gerundio НСВ (-я/-а: читая) indica simultaneità; il gerundio СВ (-в/-вши: прочитав) indica anteriorità.",
          "I sostantivi astratti che indicano intenzione, scopo o tentativo puntuale (желание, попытка, цель, готовность, решимость, отказ) reggono l'infinito СВ. I sostantivi di abitudine, tradizione o maniera (привычка, традиция, манера, страсть) e i verbi di abitudine/stanchezza (привыкнуть, отвыкнуть, устать, надоесть, разучиться) reggono l'infinito НСВ."
        ],
        esempi: [
          { russo: "Попытка сдать экзамен с первого раза оказалась успешной.", italiano: "Il tentativo di dare l'esame al primo appello si è rivelato riuscito.", nota: "попытка + infinito СВ" },
          { russo: "Привычка вставать рано помогает ему.", italiano: "L'abitudine di alzarsi presto lo aiuta.", nota: "привычка + infinito НСВ" }
        ]
      }
    ]
  },
  {
    id: "cap-5",
    numero: "Capitolo V",
    titolo: "Sistema Spaziale dei Verbi di Movimento e Traslazioni Semantiche",
    sottotitolo: "Monodirezionali vs. pluridirezionali, prefissazione spaziale ed estensioni metaforiche",
    moduloCollegato: "MODULO 10 — SITUAZIONI COMPLESSE E DIALOGHI",
    paragrafi: [
      {
        codice: "5.1 – 5.3",
        titolo: "Verbi di Movimento con e senza Prefisso e Usi Figurati",
        contenuto: [
          "Senza prefisso, entrambi i gruppi sono imperfettivi (НСВ): i monodirezionali (идти, ехать, нести) indicano un vettore unico in corso; i pluridirezionali (ходить, ездить, носить) indicano movimento abituale, multi-direzionale o un viaggio di andata e ritorno nel passato.",
          "L'aggiunta di un prefisso spaziale (при-, у-, в-, вы-, до-) al verbo monodirezionale genera il Perfettivo (СВ: прийти, уехать, войти), mentre unita alla base pluridirezionale genera l'Imperfettivo Secondario (НСВ: приходить, уезжать, входить)."
        ],
        esempi: [
          { russo: "После дискуссий исследователь пришёл к важному выводу.", italiano: "Dopo le discussioni il ricercatore è giunto a un'importante conclusione.", nota: "Traslazione metaforica (СВ)" },
          { russo: "Мне часто приходит в голову интересная мысль.", italiano: "Mi viene spesso in mente un'idea interessante.", nota: "Traslazione metaforica (НСВ)" }
        ]
      }
    ]
  }
];

export const synopticGeneralTable: SynopticRowGeneral[] = [
  { contesto: "Verbi di Fase (начать, стать, продолжать, кончить)", regola: "Infinito НСВ (obbligatorio)", esempio: "Он начал читать лекцию.", valore: "Avvio, prosieguo o cessazione del processo.", aspetto: "НСВ" },
  { contesto: "Tempo Completivo (за + Accusativo)", regola: "Verbo al Perfettivo (СВ)", esempio: "Он написал отчёт за два часа.", valore: "Traguardo raggiunto entro il limite temporale.", aspetto: "СВ" },
  { contesto: "Durata Continuativa (долго, весь день, всю неделю)", regola: "Verbo all'Imperfettivo (НСВ)", esempio: "Он долго писал отчёт.", valore: "Flusso temporale ininterrotto non delimitato.", aspetto: "НСВ" },
  { contesto: "Prosecuzione dopo Completamento Parziale (дальше)", regola: "Infinito Imperfettivo (НСВ)", esempio: "Я написал половину; дальше писать?", valore: "Continuazione dell'attività già avviata.", aspetto: "НСВ" },
  { contesto: "Iteratività / Abitualità (обычно, часто, каждый день)", regola: "Verbo all'Imperfettivo (НСВ)", esempio: "Обычно он читает свежие газеты.", valore: "Serie di atti ripetuti o consuetudinari.", aspetto: "НСВ" },
  { contesto: "Ripetizione Numerica Esatta Conclusa (три раза, дважды)", regola: "Verbo al Perfettivo (СВ)", esempio: "Он переписал сценарий три раза.", valore: "Somma di risultati completi e realizzati.", aspetto: "СВ" },
  { contesto: "Constatazione del Fatto Generico (когда-нибудь)", regola: "Verbo all'Imperfettivo (НСВ)", esempio: "Вы когда-нибудь читали этот роман?", valore: "Verifica della mera esperienza esistenziale.", aspetto: "НСВ" },
  { contesto: "Risultato Annullato (Andata e Ritorno)", regola: "Verbo all'Imperfettivo (НСВ)", esempio: "К нам приходил врач (он уже ушёл).", valore: "Azione a doppio senso, esito revocato nel presente.", aspetto: "НСВ" },
  { contesto: "Valore Perfetto (Stato Conservato)", regola: "Verbo al Perfettivo (СВ)", esempio: "Он уехал в Санкт-Петербург (его нет).", valore: "Conseguenza passata tuttora attuale nel presente.", aspetto: "СВ" },
  { contesto: "Autore di un'Opera o Scoperta Storica (Кто...?)", regola: "Verbo al Perfettivo (СВ)", esempio: "Кто сочинил оперу «Евгений Онегин»?", valore: "Identificazione del creatore di un fatto unico.", aspetto: "СВ" },
  { contesto: "Critica sulla Qualità / Difettosità dell'Esecuzione", regola: "Verbo all'Imperfettivo (НСВ)", esempio: "Кто переводил текст? Здесь сплошные ошибки!", valore: "Focus sulle modalità difettose del processo.", aspetto: "НСВ" },
  { contesto: "Processo Prolungato senza Risultato (долго..., но так и не)", regola: "НСВ (processo) + СВ (так и не)", esempio: "Он долго искал ошибку, но так и не нашёл.", valore: "Tentativo esteso seguito da fallimento dell'esito.", aspetto: "НСВ / СВ" },
  { contesto: "Azione Interrotta Prima della Fine (не + до-)", regola: "Verbo al Perfettivo con до- (СВ)", esempio: "Почему ты не дочитал книгу до конца?", valore: "Interruzione prima del completamento naturale.", aspetto: "СВ" },
  { contesto: "Modale Нельзя / Запрещено (Divieto Normativo)", regola: "Infinito НСВ", esempio: "В лаборатории нельзя трогать приборы.", valore: "Proibizione o norma generale di comportamento.", aspetto: "НСВ" },
  { contesto: "Modale Нельзя / Невозможно (Impossibilità Fisica)", regola: "Infinito СВ", esempio: "Эту дверь нельзя открыть без ключа.", valore: "Impossibilità materiale, tecnica o situazionale.", aspetto: "СВ" },
  { contesto: "Sconsiglio, Inutilità e Rimprovero (не стоит, не надо, зачем)", regola: "Infinito НСВ", esempio: "Зачем покупать столько лишних билетов?", valore: "Inopportunità o inutilità dell'atto nel complesso.", aspetto: "НСВ" },
  { contesto: "Dativo + не + Infinito (Incapacità vs. Non Spettanza)", regola: "СВ (incapacità) / НСВ (non tocca a...)", esempio: "Мне не решить задачу / Не мне решать задачу.", valore: "Impedimento oggettivo (СВ) vs. estraneità al compito (НСВ).", aspetto: "НСВ / СВ" },
  { contesto: "Sostantivi di Scopo/Tentativo vs. Abitudine", regola: "попытка/цель + СВ; привычка/традиция + НСВ", esempio: "Попытка сдать (СВ) / Привычка опаздывать (НСВ).", valore: "Traguardo singolo (СВ) vs. comportamento iterativo (НСВ).", aspetto: "НСВ / СВ" },
  { contesto: "Verbi di Abitudine, Disuso e Stanchezza (привык, устал, надоело)", regola: "Infinito НСВ", esempio: "Программист устал исправлять чужие ошибки.", valore: "Competenza o attività ripetuta nel tempo.", aspetto: "НСВ" },
  { contesto: "Imperativo Positivo (Invito Cortese vs. Richiesta Puntuale)", regola: "НСВ (ospitalità) / СВ (ordine o richiesta)", esempio: "Проходите, садитесь! / Подпишите документ!", valore: "Accoglienza/processo (НСВ) vs. singolo atto (СВ).", aspetto: "НСВ / СВ" },
  { contesto: "Imperativo Negativo (Divieto vs. Avvertimento смотри не)", regola: "не + НСВ (divieto) / смотри не + СВ (allerta)", esempio: "Не перебивайте! / Смотри не урони вазу!", valore: "Proibizione deliberata (НСВ) vs. rischio fortuito (СВ).", aspetto: "НСВ / СВ" },
  { contesto: "Imperativo di Sfida o Indifferenza a Minaccia", regola: "Imperativo НСВ (con o senza не)", esempio: "— Я доложу декану! — Докладывай!", valore: "Totale indifferenza o spavalderia verso l'interlocutore.", aspetto: "НСВ" },
  { contesto: "Relazioni Temporali (пока vs. за то время, пока)", regola: "пока + НСВ (simultaneità); за то время пока НСВ, СВ", esempio: "За то время, пока шёл симпозиум, он подготовил доклад.", valore: "Durata parallela vs. risultato completato nel frattempo.", aspetto: "НСВ / СВ" }
];

export const suffixDerivationTable: SuffixPairRow[] = [
  {
    modello: "1. Suffisso -ыва- / -ива-",
    strutturaCB: "Verbi prefissati con tema consonantico duro (-ыва-) o molle/sibilante (-ива-)",
    esempi: "переписать → переписывать; дописать → дописывать; спросить → спрашивать; опоздать → опаздывать; остановиться → останавливаться",
    note: "Frequente alternanza vocalica nella radice о → а quando la vocale è tonica nell'imperfettivo (es. опозда́ть → опа́здывать)."
  },
  {
    modello: "2. Suffisso -ва-",
    strutturaCB: "Verbi prefissati derivati da radici in -да-, -зна-, -ста- o da monosillabi (es. лить, крыть)",
    esempi: "открыть → открывать; закрыть → закрывать; передать → передавать; узнать → узнавать; встать → вставать; вылить → выливать",
    note: "I verbi derivati da -да-, -зна-, -ста- perdono il suffisso -ва- nella coniugazione del presente (es. даю, узнаю, встаю)."
  },
  {
    modello: "3. Sostituzione -и- → -а- / -я-",
    strutturaCB: "Verbi che presentano il suffisso tematico -и- al Perfettivo (СВ)",
    esempi: "решить → решать; изучить → изучать; проверить → проверять; выполнить → выполнять; получить → получать",
    note: "Sistematiche alternanze consonantiche radicali: т → ч (ответить → отвечать); д → ж (проводить → провожать); т → щ (защитить → защищать); в → вл (исправить → исправлять)."
  },
  {
    modello: "4. Sostituzione -е- → -а- / -я-",
    strutturaCB: "Verbi con suffisso -е- al Perfettivo (СВ)",
    esempi: "загореть → загорать; закипеть → закипать; обидеть → обижать",
    note: "Presenza dell'alternanza consonantica radicale (es. д → ж in обидеть → обижать)."
  },
  {
    modello: "5. Suffisso -а- / -я- (da -сти, -зти, -сть)",
    strutturaCB: "Verbi perfettivi prefissati uscenti in -сти, -зти o -сть",
    esempi: "вырасти → вырастать; спасти → спасать; напасть → нападать; слезть → слезать; расцвести → расцветать",
    note: "La consonante finale del tema appare nell'imperfettivo prima del suffisso -а- (es. подмести → подметать)."
  },
  {
    modello: "6. Suffisso -а- (da perfettivi in -чь)",
    strutturaCB: "Verbi perfettivi prefissati uscenti in -чь",
    esempi: "помочь → помогать; привлечь → привлекать; подстричь → подстригать; извлечь → извлекать",
    note: "Alternanza consonantica radicale obbligatoria: ч → г (помочь → помогать) oppure ч → к (привлечь → привлекать)."
  },
  {
    modello: "7. Scambio di suffisso -ну- → -а- / -ыва-",
    strutturaCB: "Verbi perfettivi caratterizzati dal suffisso semelfattivo/puntuale -ну-",
    esempi: "толкнуть → толкать; крикнуть → кричать; отдохнуть → отдыхать; привыкнуть → привыкать; погибнуть → погибать",
    note: "Il suffisso -ну- esprime la puntualità dell'atto; al passato alcuni verbi mantengono -ну- (толкнул), mentre altri lo perdono (достиг, погиб)."
  }
];

export const suppletivePairsTable: SuppletiveRow[] = [
  { nsv: "брать", sv: "взять", traduzione: "prendere, pigliare", note: "Coniugazione totalmente eterogenea: беру, берёшь (НСВ) vs. возьму, возьмёшь (СВ). Al passato: брал / взял." },
  { nsv: "говорить", sv: "сказать", traduzione: "dire, parlare", note: "говорить esprime il processo del parlare o l'attività verbale; сказать esprime l'atto concluso di pronunciare un'affermazione." },
  { nsv: "класть", sv: "положить", traduzione: "mettere, posare (in piano)", note: "класть appartiene alla 1ª coniugazione (кладу, кладёшь); положить si coniuga come verbo in -ить (положу, положишь)." },
  { nsv: "садиться", sv: "сесть", traduzione: "sedersi, prendere posto", note: "садиться presenta la particella riflessiva e il suffisso -и- (сажусь); сесть ha tema radicale in consonante (сяду; passato: сел)." },
  { nsv: "ложиться", sv: "лечь", traduzione: "coricarsi, andare a letto", note: "ложиться ha tema in -и- (ложусь); лечь ha tema al futuro in gutturale (лягу, ляжешь; passato: лёг, легла)." },
  { nsv: "становиться", sv: "стать", traduzione: "diventare, porsi", note: "становиться regge il caso strumentale (стану, станешь; passato: стал, стала)." },
  { nsv: "ловить", sv: "поймать", traduzione: "catturare, acchiappare", note: "Formazione suppletiva mista: l'imperfettivo usa la radice лов-, mentre il perfettivo impiega йма- con prefisso по-." },
  { nsv: "искать", sv: "найти", traduzione: "cercare / trovare", note: "Coppia correlativa che oppone il processo di ricerca (ищу, ищешь) al risultato dell'individuazione (найду, найдёшь)." },
  { nsv: "понимать", sv: "понять", traduzione: "capire, comprendere", note: "Alternanza suppletiva del tema indoeuropeo: radice -ним- all'imperfettivo (понимаю) vs. -ня- al perfettivo (пойму)." }
];

export const aktionsartTable: AktionsartRow[] = [
  { modo: "1. Начинательный (Incoativo / Ingressivo)", prefisso: "Prefissi за-, по-", significato: "Indica l'inizio o l'insorgere improvviso di un'azione, di un suono o di uno stato.", esempi: "запеть (cominciare a cantare); закричать (scoppiare a gridare); зашуметь; пойти (incamminarsi); полюбить" },
  { modo: "2. Длительно-ограничительный (Delimitativo)", prefisso: "Prefisso по-", significato: "Indica un'azione circoscritta a un breve arco temporale («per un po'»), spesso con немного.", esempi: "поработать (lavorare un po'); погулять (passeggiare un po'); посидеть; почитать (leggere un po')" },
  { modo: "3. Пердуративный (Perdurativo)", prefisso: "Prefisso про-", significato: "Indica un'azione che si protrae occupando interamente un intervallo temporale ben definito.", esempi: "прожить (vivere per N anni); проработать (lavorare tutto il giorno); простоять; промолчать" },
  { modo: "4. Однократный / Семельфактивный (Semelfattivo)", prefisso: "Suffisso -ну-", significato: "Sostituisce la durata con un unico gesto o atto istantaneo e puntuale.", esempi: "крикнуть (dare un grido); толкнуть (dare una spinta); махнуть (fare un cenno); вздрогнуть (sussultare)" },
  { modo: "5. Результативный (Risultativo / Compiuto)", prefisso: "Prefissi вы-, с-, до-, о-/об-", significato: "Esprime il raggiungimento definitivo del fine dell'azione o il completamento di un compito.", esempi: "выучить (imparare a memoria); сделать (fare completamente); дописать (finire di scrivere); оформить" },
  { modo: "6. Финитивный / Прекратительный (Finitivo)", prefisso: "Prefisso от-", significato: "Indica la cessazione definitiva di un'attività o l'esaurimento del suo ciclo naturale.", esempi: "отцвести (sfiorire); отслужить (concludere il servizio); отработать (completare il turno)" },
  { modo: "7. Накопительный / Кумулятивный (Cumulativo)", prefisso: "Prefisso на- (+ Gen. partitivo)", significato: "Esprime l'accumulo graduale di una quantità considerevole di oggetti o sostanze.", esempi: "накупить книг (comprare molti libri); нарубить дров (tagliare molta legna); напечь пирогов (sfornare molte torte)" },
  { modo: "8. Сатуративный (Saturativo / Saziativo)", prefisso: "Prefisso на- + -ся", significato: "Indica il compimento di un'azione fino a raggiungere la piena saturazione o sazietà.", esempi: "наработаться (lavorare fino a stancarsi); начитаться (leggere a sazietà); напиться; нагуляться" },
  { modo: "9. Интенсивно-усилительный (Eccessivo)", prefisso: "Prefisso пере- / за-...-ся", significato: "Esprime il superamento di un limite accettabile (eccesso) o l'assorbimento totale nell'azione.", esempi: "пересолить (salare troppo); переплатить (pagare troppo); заиграться; засидеться (trattenersi troppo)" },
  { modo: "10. Распределительный (Distributivo)", prefisso: "Prefissi пере-, по-", significato: "Esprime l'estensione progressiva di un'azione a una pluralità di oggetti o soggetti, uno dopo l'altro.", esempi: "переломать все игрушки (rompere tutti i giocattoli uno a uno); перецеловать всех детей; пооткрывать все окна" }
];

export const bibliographyList = [
  { autore: "Скворцова, Г. Л.", opera: "Употребление видов глагола в русском языке: Учебное пособие для иностранцев, изучающих русский язык (5-е изд., Москва, Русский язык. Курсы, 2005)", descrizione: "Manuale orientato all'opposizione sistematica tra imperfettivo (НСВ) e perfettivo (СВ) nei tempi passato e futuro, nell'imperativo, nell'infinito e nelle subordinate temporali." },
  { autore: "Соколовская, К. А.", opera: "Виды глагола в русской речи: Пособие по русскому языку как иностранному (Москва, Русский язык — Медиа / Дрофа, 2008)", descrizione: "Volume avanzato che analizza la nozione di «situazione aspettuale» contestualizzata nel discorso reale." },
  { autore: "Караванов, А. А.", opera: "Виды русского глагола: значение и употребление (3-е изд., Москва, Русский язык. Курсы, 2005)", descrizione: "Guida per i livelli intermedio e avanzato che organizza l'uso degli aspetti in restrizioni sintagmatiche, valori aspettuali, modali e modus." },
  { autore: "Пулькина, И. М.; Захава-Некрасова, Е. Б.", opera: "Russian: A Practical Grammar with Exercises (8th ed., Moscow, Russky Yazyk Publishers, 2000)", descrizione: "Grammatica di riferimento fondamentale per la formazione delle coppie aspettuali tramite prefissi e suffissi, alternanze fonetiche e verbi suppletivi." },
  { autore: "Timberlake, Alan & Wade, Terence", opera: "A Reference Grammar of Russian (Cambridge UP, 2004) & A Comprehensive Russian Grammar (Blackwell, 2011)", descrizione: "Trattazioni scientifiche e descrittive delle categorie verbali russe, della sintassi temporale e delle Aktionsarten." },
  { autore: "Бондарко, А. В.; Маслов, Ю. С.; Рассудова, О. П.", opera: "Fonti Teoriche Classiche dell'Aspettologia Slava (Москва, 1962–1982)", descrizione: "Fondamenti teorici sull'opposizione binaria, marcatezza del perfettivo e quadro contrastivo." }
];
