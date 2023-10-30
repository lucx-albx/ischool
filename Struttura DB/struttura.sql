#TABELLA UTENTI
#Ogni utente può registrarsi al db specificando il nome utente, il quale
#verrà controllato che sia univoco e nessun altro possa scegliere il nome
#utente di un altra persona successivamete email, password e ruolo, la voce ruolo sarebbe
#se l'utente è un docente oppure uno studente
CREATE TABLE UTENTI(
    nome_utente_crittografato VARCHAR(100) NOT NULL PRIMARY KEY,
    nome_utente VARCHAR(20) NOT NULL,
    email_utente VARCHAR(35) NOT NULL,
    password_utente VARCHAR(100) NOT NULL,
    ruolo_utente VARCHAR(10) NOT NULL
)

#TABELLA MESSAGGI
#Ogni utente potrà ricevere dei messagi, che possono essere gli inviti ai corsi
#oppure delle notifiche relative ai corsi a cui partecipa
CREATE TABLE MESSAGGI(
    nome_utente_crittografato VARCHAR(100) NOT NULL,
    nome_mittente VARCHAR(20) NOT NULL,
    corpo_messaggio VARCHAR(400),
    nome_corso VARCHAR(40),
    permesso_corso BOOLEAN,
    messaggio_letto BOOLEAN NOT NULL
)

#TABELLA CORSI
#L'utente e direttamente associato a corsi (es: classe 5L), non importa se è docente oppure studente,
#in modo da visualizzare quali cosri l'utente ha creato/segue. Del corso abbiamo una
#chiave esterna, nome_utente, e anche il nome del corso
CREATE TABLE CORSI(
    nome_utente_crittografato VARCHAR(20) NOT NULL,
    nome_corso VARCHAR(40) NOT NULL,
    permessi_corso BOOLEAN NOT NULL
)

#TABELLA MATERIE
#Ogni corso può avere più materie e più docenti e viene idendificato da due chiavi
#esterne ovvero: nome_utente, nome_corso. infine troviamo anche materia corso che
#molto semplicemente è il nome della materia (es: informatica) 
CREATE TABLE MATERIE(
    nome_utente_crittografato VARCHAR(20) NOT NULL, #CHIAVE ESTERNA
    nome_corso VARCHAR(40) NOT NULL, #CHIAVE ESTERNA
    materia_corso VARCHAR(40) NOT NULL
)

#TABELLA DATI
#A sua volta la tabella materie è associata a dati, in cui è contenuto tutto il materiale
#che il docente condivide con gli studenti. Il docente, tramite la voce dati_file, può
#condividere file, immagini, pdf... agli studenti, ma quella voce può anche essere sostituita
#da una semplice consegna scritta a mano
CREATE TABLE DATI(
    nome_utente_crittografato VARCHAR(20) NOT NULL,
    nome_corso VARCHAR(40) NOT NULL,
    materia_corso VARCHAR(40) NOT NULL,
    titolo_dati VARCHAR(30) NOT NULL,
    dati_file LONGBLOB,
    testo_dati VARCHAR(800)
)

#TABELLA ESERCIZI
#La tabella esercizi contiene gli esercizi di ogni materia che i docenti assegnano agli studenti,
#troviamo 3 chiavi esterne, il titolo dell'esercizio e la consegna. Infine abbiamo la data in cui 
#è stato pubblicato l'esercizio e la sua relativa data di scadenza
CREATE TABLE ESERCIZI(
    nome_utente_crittografato VARCHAR(20) NOT NULL,
    nome_corso VARCHAR(40) NOT NULL,
    materia_corso VARCHAR(40) NOT NULL,
    titolo_esercizio VARCHAR(30) NOT NULL,
    consega_esercizio VARCHAR(800) NOT NULL,
    data_pubblicazione DATETIME NOT NULL,
    data_fine DATETIME NOT NULL
)
