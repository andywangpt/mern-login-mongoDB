require('dotenv').config()

const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
// app.use(cors())
app.use(
	cors({
		origin: 'https://mern-login-mongodb.onrender.com',
		methods: ['GET', 'POST'],
		credentials: true,
	})
)
const port = process.env.PORT || null
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
	tls: true,
})

let db

async function run() {
	try {
		await client.connect()

		db = client.db('loginApp')
		console.log(
			'Pinged your deployment. You successfully connected to MongoDB!'
		)
		app.listen(port, () => {
			console.log('server on ', port)
		})
	} catch (error) {
		console.error('error', error)
		process.exit(1)
	}
}
run()

app.post(`${port}/register`, async (req, res) => {
	const { username, password } = req.body

	try {
		const user = await db
			.collection('authentication')
			.findOne({ username })
		if (user) return res.status(400).send('User already exists')

		const hashedPassword = await bcrypt.hash(password, 10)
		const registeredUser = await db
			.collection('authentication')
			.insertOne({ username, password: hashedPassword })
		const token = jwt.sign(
			{ id: registeredUser.insertedId, username },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		res.status(201).json({ token })
	} catch (error) {
		console.error('Error registering user:', error)
		res.status(500).send('Internal server error')
	}
})

// Login user
app.post(`${port}/login`, async (req, res) => {
	const { username, password } = req.body

	try {
		const user = await db
			.collection('authentication')
			.findOne({ username })
		if (!user) return res.status(400).send('User not found')

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch)
			return res.status(400).send('Invalid username or password')

		const token = jwt.sign(
			{ id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		res.json({ token })
	} catch (error) {
		console.error('Error logging in user:', error)
		res.status(500).send('Internal server error')
	}
})

//verify token
app.post(`${port}/api/verifyToken`, (req, res) => {
	const token = req.header('Authorization')
	if (!token) return res.status(401).send('access denied')

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		req.user = verified
		return res.status(200).send('token valid')
	} catch (err) {
		res.status(400).send('invalid token')
	}
})
