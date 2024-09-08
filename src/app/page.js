'use client'
require('dotenv').config()

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

export default function Home() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const router = useRouter()

	const handleUsernameChange = (e) => {
		setUsername(e.target.value)
	}
	const handlePasswordChange = (e) => {
		setPassword(e.target.value)
	}

	const handleCreateAccount = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/register`,
				{ username, password }
			)
			localStorage.setItem('login token', data.token)
			router.push('/dashboard')
			console.log(data)
		} catch (err) {
			console.log('err', err.response.data)
		}
	}

	const handleSignIn = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/login`,
				{ username, password }
			)
			localStorage.setItem('login token', data.token)
			router.push('/dashboard')
		} catch (err) {
			console.log('err', err.response.data)
		}
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-900'>
			<div className='bg-gray-800 p-8 rounded-md shadow-lg w-full max-w-md'>
				<h2 className='text-2xl font-bold text-white text-center mb-6'>
					Create an account
				</h2>
				<p className='text-gray-400 text-center mb-4'>
					Enter your email below to create your account
				</p>
				<form>
					<div className='mb-4'>
						<Input
							type='email'
							placeholder='name@example.com'
							value={username}
							onChange={handleUsernameChange}
							className='w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
						/>
					</div>
					<div className='mb-4'>
						<Input
							type='string'
							placeholder='password'
							value={password}
							onChange={handlePasswordChange}
							className='w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
						/>
					</div>
					<Button
						onClick={handleCreateAccount}
						className='w-full bg-indigo-600 text-white text-lg py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4'
					>
						Create Account
					</Button>
					<Button
						onClick={handleSignIn}
						className='w-full flex items-center justify-center bg-gray-700 text-white text-lg py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500'
					>
						Sign In
					</Button>
				</form>

				<p className='text-gray-400 text-center text-sm mt-6'>
					By clicking continue, you agree to our{' '}
					<a
						href='#'
						className='text-indigo-500 hover:underline'
					>
						Terms of Service
					</a>{' '}
					and{' '}
					<a
						href='#'
						className='text-indigo-500 hover:underline'
					>
						Privacy Policy
					</a>
					.
				</p>
			</div>
		</div>
	)
}
