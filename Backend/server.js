const express = require('express')
const { createPool } = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const nodemailer = require("nodemailer")
const crypto = require('crypto')

const app = express()
const port = 3001
const service_email = "ischool.service@outlook.com"
const service_password = "1sch00l!!"

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "ISCHOOL"
})

const transporter = nodemailer.createTransport({
	service: "hotmail",
	auth: {
	  user: service_email,
	  pass: service_password
	}
})

//SITI AUTORIZZATI PER COMUNICARE CON IL SERVER
// app.use(cors({
// 	origin: [
// 		'www.sitoautorizzato.it'
// 	]
// }))

//Autorizzazione per TUTTI
app.use(cors())
app.options('*', cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//funzione pre criptare
function criptaPassword(psw) {
	return new Promise((resolve, reject) => {
		const password = psw
		const data = Buffer.from(password)
		const hash = crypto.createHash('sha256')	
		
		hash.on('error', (error) => {
			reject(error)
		})

		hash.on('readable', () => {
			const hashData = hash.read()
			if (hashData) {
				const hashHex = hashData.toString('hex')
				resolve(hashHex)
			}
		})

		hash.write(data)
		hash.end()
	})
}

app.post('/invia_verifica_email', (req, res) => {
	const { emailUtente, oggetto, corpo } = req.body
	 
	const mailOptions = {
		from: service_email,
		to: emailUtente,
		subject: oggetto,
		html: corpo
	}
	 
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.json({ message: 'Errore durante l\'invio dell\'email, riprovare', status: false })
		} else {
			res.json({ message: 'Controlla la tua casella di posta elettronica, CONTROLLA ANCHE LO SPAM', status: true })
		}
	})
})

app.post('/controlla_che_email_diversa', (req, res) => {
	const { em } = req.body
	let uguale = false

	pool.query('SELECT * FROM UTENTI', (err, result)=>{
		if(err){
			res.json({ status: false })
		} else {
			if(result !== null || result !== ""){
				result.map((elem, i)=>{
					if(elem.email_utente === em && uguale === false)
						uguale = true
				})

				if(uguale === true){
					res.json({ status: false })
				} else {
					res.json({ status: true })
				}
			}
		}
	})
})

app.post('/controlla_che_nome_diverso', (req, res) => {
	const { nm } = req.body
	let uguale = false

	pool.query('SELECT * FROM UTENTI', (err, result)=>{
		if(err){
			res.json({ status: false })
		} else {
			if(result !== null || result !== ""){
				result.map((elem, i)=>{
					if(elem.nome_utente === nm && uguale === false)
						uguale = true
				})

				if(uguale === true){
					res.json({ status: false })
				} else {
					res.json({ status: true })
				}
			}
		}
	})
})

app.post('/imposta_nome_utente', (req, res) => {
	const { UN } = req.body

	pool.query('SELECT * FROM UTENTI', (err, result)=>{
		if(err){
			res.json({ message: "Errore nella ricerca del nome"})
		} else {
			result.map((elem, i)=>{
				if (elem.nome_utente_crittografato === UN ) {
					res.json({ nome_utente: elem.nome_utente })
				}
			})
		}
	})
})

app.post('/registrati', async (req, res) => {
    const { nome_utente, email, password, ruolo } = req.body
	const password_crypt = await criptaPassword(password) 
	const nome_utente_crypt = await criptaPassword(nome_utente)

	pool.query(`INSERT INTO UTENTI (nome_utente_crittografato, nome_utente, email_utente, password_utente, ruolo_utente) VALUES (?, ?, ?, ?, ?)`, [nome_utente_crypt, nome_utente, email, password_crypt, ruolo], (err, result)=>{
		if(err){
			res.json({ message: "Errore durante la registrazione.", status: true })
		} else {
			res.json({ message: "Account registrato con successo!", status: false, nome_critto: nome_utente_crypt})
		}
	})
})

app.post('/accedi', async (req, res) => {
	const { email, password } = req.body
	let password_criptata = await criptaPassword(password)
	let trovato = false
	let nmCr = ""
	let nm = ""

	pool.query('SELECT * FROM UTENTI', (err, result)=>{
		if(err){
			res.json({ status: false })
		} else {
			result.map((elem, i)=>{
				if (email === elem.email_utente && password_criptata === elem.password_utente && !trovato) {
					trovato = true
					nmCr = elem.nome_utente_crittografato
					nm = elem.nome_utente
				}
			})

			if (trovato === true) {
				res.json({ message: "Bentornato su Ischool", status: true, nome_critto: nmCr, nome_utente: nm })
			} else {
				res.json({ message: "Attenzione! Password o email errate", status: false, nome_critto: null, nome_utente: null })
			}
		}
	})
})

app.post('/controlla_ruolo', (req, res) => {
	const { UN } = req.body
	let ruolo = "Studente"

	pool.query('SELECT * FROM UTENTI', (err, result)=>{
		if(err){
			res.json({ status: null })
		} else {
			result.map((elem, i)=>{
				if (UN === elem.nome_utente_crittografato) {
					ruolo = elem.ruolo_utente
				}
			})

			if (ruolo === "Docente") {
				res.json({ status: true })
			} else {
				res.json({ status: false })
			}
		}
	})

})

app.post('/aggiungi_corso', (req, res) => {
	const { titolo_corso, nm_cr, permessi } = req.body
	let trovato = false

	pool.query('SELECT * FROM CORSI', (err, result)=>{
		if(err){
			res.json({ status: null })
		} else {
			console.log(result)
			result.map((elem, i)=>{
				if(elem.nome_utente_crittografato === nm_cr && elem.nome_corso === titolo_corso && trovato != true){
					trovato = true
				}
			})

			if(trovato === true){
				res.json({ status: false, message: 'Il titolo del corso inserito è già esistente' })
			} else {
				pool.query('INSERT INTO CORSI (nome_utente_crittografato, nome_corso, permessi_corso) VALUES (?, ?, ?)',[nm_cr, titolo_corso, permessi])
				res.json({ status: true, message: 'Corso inserito con successo' })
			}
		}
	})

})

app.post('/carica_corsi', (req, res) => {
	const { nm_cr } = req.body
	let titoli_corsi = []
	
	pool.query('SELECT * FROM CORSI', (err, result)=>{
		if(err){
			res.json({ status: null })
		} else {
			result.map((elem, i)=>{
				if(elem.nome_utente_crittografato === nm_cr){
					titoli_corsi.push(elem.nome_corso)
				}
			})
			res.json({ status: true, elementi: titoli_corsi })
		}
	})

})

app.listen(port, () =>{
    console.log(`Server in ascolto sulla porta ${port}`)
})