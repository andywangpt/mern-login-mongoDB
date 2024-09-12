// import { MongoClient } from 'mongodb'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { NextResponse } from 'next/server'

// const uri = process.env.MONGODB_URI
// const client = new MongoClient(uri)

// export async function POST(req, res) {
// 	try {
// 		const { username, password } = req.json()

// 		await client.connect()
// 		const db = client.db('loginApp')

// 		const user = await db
// 			.collection('authentication')
// 			.findOne({ username })
// 		if (user)
// 			return NextResponse.json(
// 				{ error: 'user already exists' },
// 				{ status: 400 }
// 			)

// 		const hashedPassword = await bcrypt.hash(password, 10)
// 		const registeredUser = await db
// 			.collection('authentication')
// 			.insertOne({ username, password: hashedPassword })

// 		const token = jwt.sign(
// 			{ id: registeredUser.insertedId, username },
// 			process.env.JWT_SECRET,
// 			{ expiresIn: '1h' }
// 		)

// 		return NextResponse.json(
// 			{
// 				token
// 			},
// 			{
// 				status: 201,
// 			}
// 		)
// 	} catch (error) {
// 		console.error('Error registering user:', error)
// 		res.status(500).send('Internal server error')
// 	} finally {
// 		await client.close()
// 	}
// }

import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const uri = process.env.MONGODB_URI
let client
let db

if (!client) {
	client = new MongoClient(uri)
}

async function connectToDB() {
	if (!db) {
		await client.connect()
		db = client.db('loginApp')
	}
	return db
}

export async function POST(req) {
	try {
		const { username, password } = await req.json() // Await the req.json()

		const db = await connectToDB() // Reuse the DB connection

		const user = await db
			.collection('authentication')
			.findOne({ username })
		if (user) {
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 400 }
			)
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const registeredUser = await db
			.collection('authentication')
			.insertOne({ username, password: hashedPassword })

		const token = jwt.sign(
			{ id: registeredUser.insertedId, username },
			process.env.JWT_SECRET,
			{
				expiresIn: '1h',
			}
		)

		return NextResponse.json({ token }, { status: 201 })
	} catch (error) {
		console.error('Error registering user:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

