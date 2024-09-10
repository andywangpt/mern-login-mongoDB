'use client'
require('dotenv').config()
// import { Button, Input, Select } from '@shadcn/ui'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
	const isDevelopment =
		process.env.NEXT_PUBLIC_NODE_ENV !== 'production'
	const port = process.env.NEXT_PUBLIC_PORT || 5000

	const apiUrl = isDevelopment
		? 'http://localhost:5000'
		: `https://mern-login-mongo-db.vercel.app/${port}`

	const router = useRouter()
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		const token = localStorage.getItem('login token')

		if (!token) {
			router.push('/')
		} else {
			axios
				.post(
					`${apiUrl}/api/verifyToken`,
					{},
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: token,
						},
					}
				)
				.then((response) => {
					setIsAuthenticated(true)
				})
				.catch((error) => {
					localStorage.removeItem('login token')
					router.push('/')
				})
		}
	}, [router])

	if (!isAuthenticated) {
		return <div>Loading...</div>
	}

	const handleLogOut = (e) => {
		e.preventDefault()
		localStorage.removeItem('login token')
		router.push('/')
	}

	return (
		<div className='bg-gray-800 min-h-screen text-white p-10'>
			<header className='flex justify-between items-center mb-10'>
				<div>
					<h1 className='text-3xl font-bold'>Dashboard</h1>
					<div className='flex space-x-4 mt-4'>
						<Button variant='outline'>Overview</Button>
						<Button variant='outline'>Analytics</Button>
						<Button variant='outline'>Reports</Button>
						<Button variant='outline'>Notifications</Button>
					</div>
				</div>
				<div className='flex items-center space-x-4'>
					<Input placeholder='Search...' />
					<Button icon='download'>Download</Button>
					<Select
						defaultValue='1'
						options={[
							{
								label: 'Jan 20, 2023 - Feb 09, 2023',
								value: '1',
							},
						]}
					/>
					<Button icon='user-circle-o'>Alicia Koch</Button>
					<Button
						className='bg-purple-500'
						onClick={handleLogOut}
					>
						Sign Out
					</Button>
				</div>
			</header>
			<div className='grid grid-cols-3 gap-10'>
				<div className='space-y-6'>
					<div className='bg-gray-700 p-4 rounded-lg'>
						<h2 className='text-lg font-semibold'>
							Total Revenue
						</h2>
						<p className='text-3xl'>$45,231.89</p>
						<p className='text-sm text-gray-400'>
							+20.1% from last month
						</p>
					</div>
					<div className='bg-gray-700 p-4 rounded-lg'>
						<h2 className='text-lg font-semibold'>
							Subscriptions
						</h2>
						<p className='text-3xl'>+2350</p>
						<p className='text-sm text-gray-400'>
							+18.1% from last month
						</p>
					</div>
				</div>
				<div className='col-span-2 bg-gray-700 p-4 rounded-lg'>
					<h2 className='text-lg font-semibold'>Overview</h2>
					{/* This should be replaced with an actual chart component */}
					<div className='h-64 bg-gray-600'></div>
				</div>
				<div className='bg-gray-700 p-4 rounded-lg'>
					<h2 className='text-lg font-semibold'>Sales</h2>
					<p className='text-3xl'>+12,234</p>
					<p className='text-sm text-gray-400'>
						+19% from last month
					</p>
				</div>
				<div className='col-span-2 bg-gray-700 p-4 rounded-lg'>
					<h2 className='text-lg font-semibold'>Recent Sales</h2>
					<ul className='space-y-4'>
						<li>Olivia Martin - $1,999.00</li>
						<li>Jackson Lee - $39.00</li>
						<li>Isabella Nguyen - $299.00</li>
						<li>William Kim - $99.00</li>
						<li>Sofia Davis - $39.00</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
