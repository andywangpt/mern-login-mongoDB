import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
	console.log('verify hit')

	// if (req.method !== 'POST') {
	// 	return res.status(405).json({ error: 'Method not allowed' })
	// }

	// const token = req.headers.authorization
	const token = req.headers.get('authorization')
	if (!token) return res.status(401).json({ error: 'Access denied' })

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		req.user = verified // Attach user to request object if needed later
		// return res.status(200).json({ message: 'Token valid' })
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
	} catch (err) {
		res.status(400).json({ error: 'Invalid token' })
	}
}
