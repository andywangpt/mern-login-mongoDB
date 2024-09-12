
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

export async function POST(req, res) {
	console.log("api hit")
// 	return NextResponse.json({ message: "Hello from API"})
// }
	// if (req.method !== 'POST') {
	// 	return res.status(405).json({ error: 'Method not allowed on login' })
	// }

	// const { username, password } = await req.body
	const { username, password } = await req.json()

	try {
		await client.connect()
		console.log("successfully connected to MongoDB")
		const db = client.db('loginApp')

		const user = await db
			.collection('authentication')
			.findOne({ username })
		if (!user)
			return res.status(400).json({ error: 'User not found' })

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch)
			return res.status(400).json({ error: 'invalid username' })

		const token = jwt.sign(
			{ id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		// res.json({ token })

		        return NextResponse.json(
						{ token },
						{
							status: 200,
							headers: {
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods':
									'GET, POST, PUT, DELETE, OPTIONS',
								'Access-Control-Allow-Headers':
									'Content-Type, Authorization',
							},
						}
					)
	} catch (error) {
		console.log('error loggin in user:', error)
		res.status(500).json({ error: 'internal server error' })
	} finally {
		await client.close()
	}
}


// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request) {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}