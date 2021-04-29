# Gestione Note Scolastiche | Diario di lavoro

##### Aris Previtali, Francisco Viola, Ismael Trentin e Nicola Ambrosetti.

### Scuola Arti e Mestieri Trevano, 29 aprile 2021

## Lavori svolti

| Aris          | Lavoro svolto                                                                 |
| ------------- | ----------------------------------------------------------------------------- |
| 8.20 - 9.50   | Ha iniziato il diagramma di Gantt consuntivo con l'aiuto di Nicola Ambrosetti |
| 10.05 - 11.35 | Ha continuato il diagramma di Gantt sempre con l'aiuto di Nicola              |
| 13.15 - 14.00 | Si e' occupato di scrivere la JS doc per i files della REST API               |
| 14.15 - 15.45 | Ha continuato a scrivere la JS doc per la REST API                            |

| Francisco     | Lavoro svolto                                                                        |
| ------------- | ------------------------------------------------------------------------------------ |
| 8.20 - 9.50   | Si e' occupato della documentazione, prima della Implementazine                      |
| 10.05 - 11.35 | Sempre della documentazione ha steso i Test                                          |
| 12.30 - 14.00 | Ha scritto le conclusioni generali con il contributo degli altri compagni del gruppo |
| 14.15 - 15.45 | Come ultimo capitolo ha documentato gli sviluppi futuri                              |

| Nicola        | Lavoro svolto                                                                            |
| ------------- | ---------------------------------------------------------------------------------------- |
| 8.20 - 9.50   | Ha aiutato Aris a creare il diagramma di Gantt                                           |
| 10.05 - 11.35 | Ha continuato ad offrire il suo supporto per Aris lavorando per il Gantt                 |
| 12.30 - 14.00 | Ha aiutato Ismael a rifare la configurazione del raspberry per poter hostare il progetto |
| 14.15 - 15.45 | Ha aiutato Francisco a stendere il suo ultimo capitolo della documentazione              |

| Ismael        | Lavoro svolto                                                             |
| ------------- | ------------------------------------------------------------------------- |
| 8.20 - 9.50   | Ha iniziato il capitolo delle mancanze della documentazione               |
| 10.05 - 11.35 | Ha scritto la JS doc per il MongoHelper                                   |
| 12.30 - 14.00 | Ha configurato il raspberry per hostare il progetto con l'aiuto di Nicola |
| 14.15 - 15.45 | Si e' occupato di scrivere il diario della giornata                       |

## Problemi riscontrati e soluzioni adottate

Il proxy della scuola blocca la connessione per scaricare l'ultima versione di MongoDB. Di conseguenza, per ora, non possiamo usare questo raspberry per hostare il progetto siccoma alcune funzioni non sono supportate in questa versione. Per risolvere questo problema abbiamo provato a impostare il proxy in `/etc/enviroment` con `http_proxy` e `https_proxy`. Purtroppo pero' ci dava sempre un errore `407` `Proxy Authentication Required` nonostante le credenziali venivano passate correttamente. Non siamo riusciti a risolvere questo problema quindi porteremo il raspberry a casa e lo configureremo li'.

## Punto della situazione rispetto alla pianificazione

A buon punto con il progetto. La documentazione pero', e' leggermente indietro rispetto alla pianificazione. Dobbiamo ancora iniziare la presentazione.

## Programma di massima per la prossima giornata di lavoro

- Fixare tutti i bug presenti nell'applicazione
- Concludere o almeno arrivare ad un buon punto con la documentazione
- Iniziare la presentazione
