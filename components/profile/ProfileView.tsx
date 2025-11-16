'use client'

import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

type ProfileViewProps = {
	user: {
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
	onEdit?: () => void
}

export default function ProfileView({ user, onEdit }: ProfileViewProps) {
	return (
		<Card className="max-w-3xl mx-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
			<CardHeader className="items-center pb-0 pt-8">
				<div className="relative h-28 w-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-neutral-100">
					{user.profileImage ? (
						<Image
							src={user.profileImage}
							alt={user.name}
							fill
							sizes="96px"
							className="object-cover"
						/>
					) : (
						<div className="h-full w-full flex items-center justify-center text-2xl font-semibold text-neutral-500">
							{user.name?.charAt(0)?.toUpperCase() || 'U'}
						</div>
					)}
				</div>
				<CardTitle className="mt-4 text-2xl">{user.name || user.email}</CardTitle>
				<CardDescription className="text-neutral-500">{user.email}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-8 pt-6 pb-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="min-w-0">
						<p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">Full Name</p>
						<p className="text-sm font-medium text-neutral-900 break-words">{user.name || '-'}</p>
					</div>
					<div className="min-w-0">
						<p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">Mobile</p>
						<p className="text-sm font-medium text-neutral-900 break-words">{user.mobile || '-'}</p>
					</div>
					<div className="sm:col-span-2 min-w-0">
						<p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">Email</p>
						<p className="text-sm font-medium text-neutral-900 break-words">{user.email}</p>
					</div>
				</div>

				<div className="border-t border-neutral-200" />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="sm:col-span-2 min-w-0">
						<p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">Address</p>
						<p className="text-sm text-neutral-900 break-words">{user.address || '-'}</p>
					</div>
					<div className="min-w-0">
						<p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">Interest Field</p>
						<p className="text-sm text-neutral-900">
							{(user.interests && user.interests.length > 0)
								? user.interests.join(', ')
								: (user.interestField || '-')}
						</p>
					</div>
					<div className="sm:col-span-2 min-w-0">
						<p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">Bio</p>
						<p className="text-sm text-neutral-900 whitespace-pre-line break-words">{user.bio || '-'}</p>
					</div>
					<div className="sm:col-span-2 min-w-0">
						<p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">Skills</p>
						<p className="text-sm text-neutral-900 break-words">
							{user.skills && user.skills.length > 0 ? user.skills.join(', ') : '-'}
						</p>
					</div>
				</div>

				{onEdit && (
					<div className="pt-2 flex justify-center">
						<Button onClick={onEdit} className="px-6">
							Edit Profile
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	)
}


