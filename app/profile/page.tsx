'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfileView from '@/components/profile/ProfileView'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import { useUser } from '@/components/providers/UserProvider'

type ProfileData = {
	_id: string
	name: string
	email: string
	mobile: string
	profileImage?: string
	address?: string
	interestField?: string
	interests?: string[]
	bio?: string
	skills?: string[]
}

export default function ProfilePage() {
	const router = useRouter()
	const { user, isLoading } = useUser()
	const [profile, setProfile] = useState<ProfileData | null>(null)
	const [mode, setMode] = useState<'view' | 'edit'>('view')
	const currentEmail = useMemo(() => user?.email || '', [user])

	// Redirect if not logged in
	useEffect(() => {
		if (isLoading) return
		if (!user) {
			router.replace('/')
		}
	}, [user, isLoading, router])

	// Helper to fetch profile from API and set state
	const fetchAndSetProfile = async (email: string) => {
		if (!email) return
		try {
			const res = await fetch('/api/users/profile', {
				headers: { 'x-user-email': email },
			})
			const data = await res.json()
			if (!res.ok || !data?.success) {
				throw new Error(data?.error || 'Failed to load profile')
			}
			setProfile(data.user as ProfileData)
		} catch (err) {
			console.error('Load profile error:', err)
		}
	}

	// Fetch profile when email is available
	useEffect(() => {
		fetchAndSetProfile(currentEmail)
	}, [currentEmail])

	if (isLoading || !user) {
		return null
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				

				{mode === 'view' && profile && (
					<ProfileView
						user={profile}
						onEdit={() => setMode('edit')}
					/>
				)}

				{mode === 'edit' && profile && (
					<ProfileEditForm
						initialUser={profile}
						onCancel={() => setMode('view')}
						onSaved={async (updated) => {
							// Re-fetch canonical DB state after save to avoid stale client state
							await fetchAndSetProfile(updated.email || currentEmail)
							setMode('view')
						}}
					/>
				)}
			</main>
		</div>
	)
}


