1. [Introduzione](#introduzione)

  - [Informazioni sul progetto](#informazioni-sul-progetto)

  - [Abstract](#abstract)

  - [Scopo](#scopo)

1. [Analisi](#analisi)

  - [Analisi del dominio](#analisi-del-dominio)
  
  - [Analisi dei mezzi](#analisi-dei-mezzi)

  - [Analisi e specifica dei requisiti](#analisi-e-specifica-dei-requisiti)

  - [Use case](#use-case)

  - [Pianificazione](#pianificazione)

1. [Progettazione](#progettazione)

  - [Design dell’architettura del sistema](#design-dell’architettura-del-sistema)

  - [Design dei dati e database](#design-dei-dati-e-database)

1. [Implementazione](#implementazione)

1. [Test](#test)

  - [Protocollo di test](#protocollo-di-test)

  - [Risultati test](#risultati-test)

  - [Mancanze/limitazioni conosciute](#mancanze/limitazioni-conosciute)

1. [Consuntivo](#consuntivo)

1. [Conclusioni](#conclusioni)

  - [Sviluppi futuri](#sviluppi-futuri)

  - [Considerazioni personali](#considerazioni-personali)

1. [Sitografia](#sitografia)

1. [Allegati](#allegati)


## Introduzione

### Informazioni sul progetto

Questo progetto è realizzato da Ambrosetti Nicola, Previtali Aris, Trentin Francisco e Viola Francisco, della classe I3A.
Il progetto in questione coinvolge inoltre il docente Luca Muggiasca, che si è occupato di svolgere il ruole di mandate e di docente responsabile, docente che si occupa di assistere gli allievi durante lo svolgimento del progetto.
Il progetto viene realizzati a partire dal 14 gennaio 2021 fino al dd/mm/yyyy, presso la SAMT (Scuola D'Arti E Mestieri Trevano), nella sezione informatica, per il Modulo 306 + Progetti.
Durante questo progetto, oltre alla realizzazione verrano tenuti dei diari e una documentazione, che permetterano di mostrare come e quando gli allievi hanno svolto le determinate attività, nelle diverse sessioni di lavoro.
Alla fine del progetto verrà svolta una presentaazione da parte di tutti gli individui del gruppo, utile per mostrare il risultato finale ottenuto nei mesi di lavoro.

### Abstract

Nel corso degli anni, la tecnologia e l'informatica han permesso di sviluppare tanti applicativi utili in tutti i settori immaginabili.
Per il settore scolastico sono state sviluppate delle applicazioni che permettono di marcare tutte le note ottenute nel corso del semestre, filtrandole per materie, docenti o altri parametri ancora.
Nessuno di questi applicativi hanno però la possibilità di gestire gli utenti di un'intera scuola, permettendo agli utenti di poter accedere in qualsiasi momento, in un qualsiasi luogo, ottenendo tutti le proprie note.
Questo è infatti lo scopo del nostro progetto, fare in modo che gli utenti, grazie al nome utente e la password usato per l'account dei PC della scuola vengano utilizazti sul applicativo WEB, così che le loro note sono sempre sincronizzate e disponibili, senza dover creare un nuovo account per un ennesimo nuovo servizio.

  E’ una breve e accurata rappresentazione dei contenuti di un documento,
  senza notazioni critiche o valutazioni. Lo scopo di un abstract efficace
  dovrebbe essere quello di far conoscere all’utente il contenuto di base
  di un documento e metterlo nella condizione di decidere se risponde ai
  suoi interessi e se è opportuno il ricorso al documento originale.

  Può contenere alcuni o tutti gli elementi seguenti:

  -   **Background/Situazione iniziale**

  -   **Descrizione del problema e motivazione**: Che problema ho cercato
      di risolvere? Questa sezione dovrebbe includere l'importanza del
      vostro lavoro, la difficoltà dell'area e l'effetto che potrebbe
      avere se portato a termine con successo.

  -   **Approccio/Metodi**: Come ho ottenuto dei progressi? Come ho
      risolto il problema (tecniche…)? Quale è stata l’entità del mio
      lavoro? Che fattori importanti controllo, ignoro o misuro?

  -   **Risultati**: Quale è la risposta? Quali sono i risultati? Quanto è
      più veloce, più sicuro, più economico o in qualche altro aspetto
      migliore di altri prodotti/soluzioni?

  Esempio di abstract:

  > *As the size and complexity of today’s most modern computer chips
  > increase, new techniques must be developed to effectively design and
  > create Very Large Scale Integration chips quickly. For this project, a
  > new type of hardware compiler is created. This hardware compiler will
  > read a C++ program, and physically design a suitable microprocessor
  > intended for running that specific program. With this new and powerful
  > compiler, it is possible to design anything from a small adder, to a
  > microprocessor with millions of transistors. Designing new computer
  > chips, such as the Pentium 4, can require dozens of engineers and
  > months of time. With the help of this compiler, a single person could
  > design such a large-scale microprocessor in just weeks.*

### Scopo

Lo scopo del progetto è di creare un gestore delle note scolastiche per gli allievi del CPT. Non ne usufruiranno solo gli allievi siccome anche i docenti potranno accedervi e vedere le note di ogni allievo per la specifica materia. Oltre alla gestione delle note, l'applicazione offrirà anche una vista generale ed un andamento dell'allievo così da poter tenere la propria situazione sott'occhio facilmente. Integrando l'Active Directory della scuola ci si assicurerà l'utilizzo solo da utenti registrati nell'infrastruttura scolastica.


## Analisi

### Analisi del dominio

Moltissime app offrono già la possibilità di organizzare le proprie note scolastiche e altro. Spesso però sono per singoli utenti e sono unicamente per dispositivi portatili come i cellulari. Abbiamo quindi l'obiettivo di ampliare queste funzionalita' e portare questo tipo di applicativo ad un altro livello. Grazie all'AD della scuola si potranno ottenere le informazioni di login di ogni allievo, docente e persona registrata nell'infrastruttura scolastica. Ogni utente, che deve essere registrato nella scuola, avrà quindi la possibilità di gestire le proprie note scolastiche che saranno accessibili ovunque grazie all'account di scuola. Per poter usare quest'app sono richieste delle competenze base sull'uso del computer e di un sito web.

### Analisi e specifica dei requisiti

  | **ID**  |**Nome**			|**Priorità**|**Vers**|**Note**  |
  |---------|------------|--------|----|------|
  | Req - 0 | App web | 1 | 1.0 |  |
  | Req - 1 | Prendere dati dall'AD con LDAP | 1 | 1.0 |  |
  | Req - 2 | Utente Allievo | 1 | 1.0 |  |
  | Req - 2.1 | Pagina andamento | 1| 1.0| |
  | Req - 3 | Utente docente | 1 | 1.0| |
  | Req - 3.1 | Possibiltà di vedere tutti gli allievi e le loro note | 1 | 1.0 | |
  | Req - 4 | Utente amministratore | 1 | 1.0||
  | Req - 4.1 | Gestione utente | 1 | 1.0 | |
  | Req - 4.2 | Gestione dati e parametri | 1 | 1.0 | |
  | Req - 4.3 | Aggiungere materie e categorie | 1 | 1.0 ||
  | Req - 5 | Aggiungere materie | 1 | 1.0 | |
  | Req - 6 | Aggiungere note con la relativa data | 1 | 1.0||
  | Req - 7 | Filtri | 1 | 1.0 | |
  | Req - 7.1 | In base alle materie (allievi) | 1 | 1.0||
  | Req - 7.2 | In base agli allievi (docenti) | 1 | 1.0 ||
  



**Spiegazione elementi tabella dei requisiti:**

**ID**: identificativo univoco del requisito

**Nome**: breve descrizione del requisito

**Priorità**: indica l’importanza di un requisito nell’insieme del
progetto, definita assieme al committente. Ad esempio poter disporre di
report con colonne di colori diversi ha priorità minore rispetto al
fatto di avere un database con gli elementi al suo interno. Solitamente
si definiscono al massimo di 2-3 livelli di priorità.

**Versione**: indica la versione del requisito. Ogni modifica del
requisito avrà una versione aggiornata.

Sulla documentazione apparirà solamente l’ultima versione, mentre le
vecchie dovranno essere inserite nei diari.

**Note**: eventuali osservazioni importanti o riferimenti ad altri
requisiti.

**Sotto requisiti**: elementi che compongono il requisito.


### Use case

I casi d’uso rappresentano l’interazione tra i vari attori e le
funzionalità del prodotto.

### Pianificazione

Prima di iniziare in maniera effettiva a lavorare sulla parte pratica del progetto, tutto il gruppo ha svolta una sorta di riunione che ha permesso a tutti i partecipanti di discutere su varie metdologie per gestire al meglio lo sviluppo del progetto.
Il gruppo ha quindi deciso di utilizzare diverse metodologie per pianificare al meglio lo svolgimento del progetto.
La pianificazione del progetto è stata quindi fatta utilizzando un gantt, che permette di suddividere il progetto in fasi, con diverse importanze e priorità.
Il secondo strumento che il gruppo ha deciso di utilizzare è l'applicativo web trello, che ti permette di suddividere in più fasi tutto ciò che bisgona fare sul arco del progetto, assegnadogli delle etichette, delle categorie, degli utenti e delle cartelle.

Questi sono i rispettivi mezzi che abbiamo utilizzato:<br>
<gantt> <trello>

### Analisi dei mezzi

Elencare e *descrivere* i mezzi disponibili per la realizzazione del
progetto. Ricordarsi di sempre descrivere nel dettaglio le versioni e il
modello di riferimento.

SDK, librerie, tools utilizzati per la realizzazione del progetto e
eventuali dipendenze.

Su quale piattaforma dovrà essere eseguito il prodotto? Che hardware
particolare è coinvolto nel progetto? Che particolarità e limitazioni
presenta? Che hw sarà disponibile durante lo sviluppo?

## Progettazione

Questo capitolo descrive esaustivamente come deve essere realizzato il
prodotto fin nei suoi dettagli. Una buona progettazione permette
all’esecutore di evitare fraintendimenti e imprecisioni
nell’implementazione del prodotto.

### Design dell’architettura del sistema

Descrive:

-   La struttura del programma/sistema lo schema di rete...

-   Gli oggetti/moduli/componenti che lo compongono.

-   I flussi di informazione in ingresso ed in uscita e le
    relative elaborazioni. Può utilizzare *diagrammi di flusso dei
    dati* (DFD).

-   Eventuale sitemap

### Design dei dati e database

Descrizione delle strutture di dati utilizzate dal programma in base
agli attributi e le relazioni degli oggetti in uso.

### Schema E-R, schema logico e descrizione.

Se il diagramma E-R viene modificato, sulla doc dovrà apparire l’ultima
versione, mentre le vecchie saranno sui diari.

### Design delle interfacce

Descrizione delle interfacce interne ed esterne del sistema e
dell’interfaccia utente. La progettazione delle interfacce è basata
sulle informazioni ricavate durante la fase di analisi e realizzata
tramite mockups.

### Design procedurale

Descrive i concetti dettagliati dell’architettura/sviluppo utilizzando
ad esempio:

-   Diagrammi di flusso e Nassi.

-   Tabelle.

-   Classi e metodi.

-   Tabelle di routing

-   Diritti di accesso a condivisioni …

Questi documenti permetteranno di rappresentare i dettagli procedurali
per la realizzazione del prodotto.

## Implementazione

In questo capitolo dovrà essere mostrato come è stato realizzato il
lavoro. Questa parte può differenziarsi dalla progettazione in quanto il
risultato ottenuto non per forza può essere come era stato progettato.

Sulla base di queste informazioni il lavoro svolto dovrà essere
riproducibile.

In questa parte è richiesto l’inserimento di codice sorgente/print
screen di maschere solamente per quei passaggi particolarmente
significativi e/o critici.

Inoltre dovranno essere descritte eventuali varianti di soluzione o
scelte di prodotti con motivazione delle scelte.

Non deve apparire nessuna forma di guida d’uso di librerie o di
componenti utilizzati. Eventualmente questa va allegata.

Per eventuali dettagli si possono inserire riferimenti ai diari.

## Test

### Protocollo di test

Definire in modo accurato tutti i test che devono essere realizzati per
garantire l’adempimento delle richieste formulate nei requisiti. I test
fungono da garanzia di qualità del prodotto. Ogni test deve essere
ripetibile alle stesse condizioni.


|Test Case      | TC-001                               |
|---------------|--------------------------------------|
|**Nome**       |Import a card, but not shown with the GUI |
|**Riferimento**|REQ-012                               |
|**Descrizione**|Import a card with KIC, KID and KIK keys with no obfuscation, but not shown with the GUI |
|**Prerequisiti**|Store on local PC: Profile\_1.2.001.xml (appendix n\_n) and Cards\_1.2.001.txt (appendix n\_n) |
|**Procedura**     | - Go to “Cards manager” menu, in main page click “Import Profiles” link, Select the “1.2.001.xml” file, Import the Profile - Go to “Cards manager” menu, in main page click “Import Cards” link, Select the “1.2.001.txt” file, Delete the cards, Select the “1.2.001.txt” file, Import the cards |
|**Risultati attesi** |Keys visible in the DB (OtaCardKey) but not visible in the GUI (Card details) |


### Risultati test

Tabella riassuntiva in cui si inseriscono i test riusciti e non del
prodotto finale. Se un test non riesce e viene corretto l’errore, questo
dovrà risultare nel documento finale come riuscito (la procedura della
correzione apparirà nel diario), altrimenti dovrà essere descritto
l’errore con eventuali ipotesi di correzione.

### Mancanze/limitazioni conosciute

Descrizione con motivazione di eventuali elementi mancanti o non
completamente implementati, al di fuori dei test case. Non devono essere
riportati gli errori e i problemi riscontrati e poi risolti durante il
progetto.

## Consuntivo

Consuntivo del tempo di lavoro effettivo e considerazioni riguardo le
differenze rispetto alla pianificazione (cap 1.7) (ad esempio Gannt
consuntivo).

## Conclusioni

Quali sono le implicazioni della mia soluzione? Che impatto avrà?
Cambierà il mondo? È un successo importante? È solo un’aggiunta
marginale o è semplicemente servita per scoprire che questo percorso è
stato una perdita di tempo? I risultati ottenuti sono generali,
facilmente generalizzabili o sono specifici di un caso particolare? ecc

### Sviluppi futuri
  Migliorie o estensioni che possono essere sviluppate sul prodotto.

### Considerazioni personali
  Cosa ho imparato in questo progetto? ecc

## Bibliografia

### Bibliografia per articoli di riviste
1.  Cognome e nome (o iniziali) dell’autore o degli autori, o nome
    dell’organizzazione,

2.  Titolo dell’articolo (tra virgolette),

3.  Titolo della rivista (in italico),

4.  Anno e numero

5.  Pagina iniziale dell’articolo,

### Bibliografia per libri


1.  Cognome e nome (o iniziali) dell’autore o degli autori, o nome
    dell’organizzazione,

2.  Titolo del libro (in italico),

3.  ev. Numero di edizione,

4.  Nome dell’editore,

5.  Anno di pubblicazione,

6.  ISBN.

### Sitografia

1.  URL del sito (se troppo lungo solo dominio, evt completo nel
    diario),

2.  Eventuale titolo della pagina (in italico),

3.  Data di consultazione (GG-MM-AAAA).

**Esempio:**

-   http://standards.ieee.org/guides/style/section7.html, *IEEE
    Standards Style Manual*, 07-06-2008.

## Allegati

Elenco degli allegati, esempio:

-   Diari di lavoro

-   Codici sorgente/documentazione macchine virtuali

-   Istruzioni di installazione del prodotto (con credenziali
    di accesso) e/o di eventuali prodotti terzi

-   Documentazione di prodotti di terzi

-   Eventuali guide utente / Manuali di utilizzo

-   Mandato e/o Qdc

-   Prodotto

-   …