require('dotenv').config()

const url = process.env.DATABASE_URL
// Połączenie z bazą danych
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true })

let db

client.connect(err => {
	if (err) {
		console.error(err)
		return
	}
	console.log('Connected to database')
	db = client.db('words')
})

// Pobranie losowego słowa z bazy
const getWord = async () => {
	try {
		const words = db.collection('words')
		const count = await words.countDocuments()
		const randomIndex = Math.floor(Math.random() * count)
		const word = await words.findOne({}, { skip: randomIndex })
		document.querySelector('#word').textContent = word.polish
		return word
	} catch (error) {
		console.error(error)
	}
}

// Sprawdzenie odpowiedzi użytkownika
const checkAnswer = (word, answer) => {
	if (word.english === answer) {
		alert('Poprawna odpowiedź!')
	} else {
		alert(`Niepoprawna odpowiedź. Poprawne tłumaczenie to: ${word.english}`)
	}
}

// Dodanie nowego słowa do bazy danych
const addWord = async (polish, english) => {
	try {
		await axios.post(apiUrl, { polish, english })
		alert('Słowo dodane do bazy danych!')
	} catch (error) {
		console.error(error)
	}
}

// Inicjalizacja quizu
const init = async () => {
	const word = await getWord()

	document.querySelector('#submit').addEventListener('click', () => {
		const answer = document.querySelector('#answer').value
		checkAnswer(word, answer)
		document.querySelector('#answer').value = ''
		getWord()
	})

	document.querySelector('#add-word').addEventListener('click', () => {
		const polish = document.querySelector('#new-word-polish').value
		const english = document.querySelector('#new-word-english').value
		addWord(polish, english)
		document.querySelector('#new-word-polish').value = ''
		document.querySelector('#new-word-english').value = ''
	})
}

init()
