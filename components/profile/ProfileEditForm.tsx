'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import AvatarUploader from '@/components/profile/AvatarUploader'
import toast from 'react-hot-toast'
import { useUser } from '@/components/providers/UserProvider'
import { profileUpdateSchema } from '@/lib/validators/profileSchema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const schema = profileUpdateSchema.extend({
	// For the UI, we keep a single input; allow empty
	skills: z.string().optional().transform((v) => v ?? ''),
})

type FormValues = z.infer<typeof schema>

type ProfileEditFormProps = {
	initialUser: {
		_id: string
		name: string
		email: string
		mobile: string
		profileImage?: string
		address?: string
		interestField?: string
		bio?: string
		skills?: string[]
	}
	onCancel?: () => void
	onSaved?: (updated: { _id: string; name: string; email: string; mobile: string; profileImage?: string }) => void
}

export default function ProfileEditForm({ initialUser, onCancel, onSaved }: ProfileEditFormProps) {
	const { login } = useUser()
	const [submitting, setSubmitting] = useState(false)

	const defaultValues: FormValues = useMemo(
		() => ({
			name: initialUser.name || '',
			mobile: initialUser.mobile || '',
			email: initialUser.email || '',
			address: initialUser.address || '',
			interestField: initialUser.interestField || '',
			bio: initialUser.bio || '',
			profileImage: initialUser.profileImage,
			skills: (initialUser.skills || []).join(', '),
		}),
		[initialUser]
	)

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues,
	})

	const submit = async (values: FormValues) => {
		setSubmitting(true)
		try {
			// Normalize skills to array
			const normalizedSkills = (values.skills || '')
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean)
			// Normalize interests to array (reuse the interestField input as interests)
			const normalizedInterests = (values.interestField || '')
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean)

			const res = await fetch('/api/users/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					// Provide email from client session (UserProvider) for the API to identify the user
					'x-user-email': initialUser.email,
				},
				body: JSON.stringify({
					name: values.name,
					mobile: values.mobile,
					email: values.email,
					address: values.address,
					interests: normalizedInterests,
					bio: values.bio,
					skills: normalizedSkills,
					profileImage: values.profileImage,
				}),
			})

			const data = await res.json()
			if (!res.ok || !data?.success) {
				throw new Error(data?.error || 'Failed to update profile')
			}

			// Re-fetch authoritative profile from server to avoid any drift
			const refetch = await fetch('/api/users/profile', {
				headers: {
					'x-user-email': data.user?.email || initialUser.email,
				},
			})
			const fresh = await refetch.json()
			if (!refetch.ok || !fresh?.success) {
				throw new Error(fresh?.error || 'Failed to fetch updated profile')
			}

			const full = fresh.user as {
				_id: string
				name: string
				email: string
				mobile: string
				profileImage?: string
			}

			// Update UserProvider storage (persist minimal fields incl. profileImage for avatar rendering)
      login({
        _id: full._id,
        name: full.name,
        email: full.email,
        mobile: full.mobile,
        profileImage: full.profileImage,
      } as any)

			toast.success('Profile updated successfully')
			onSaved?.(full)
		} catch (err: any) {
			console.error('Update profile error:', err)
			toast.error(err?.message || 'Failed to update profile')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(submit)} className="max-w-3xl mx-auto">
			<Card className="rounded-2xl border border-neutral-200 shadow-sm">
				<CardHeader>
					<CardTitle className="text-xl">Edit Profile</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
			<div>
				<AvatarUploader
					initialUrl={initialUser.profileImage}
					onUploaded={(url) => setValue('profileImage', url, { shouldValidate: false, shouldDirty: true })}
				/>
				{errors.profileImage && <p className="mt-2 text-sm text-red-600">{errors.profileImage.message}</p>}
			</div>

			<div>
				<p className="text-xs text-neutral-500 mb-2">Full Name</p>
				<Input
					{...register('name')}
					placeholder="Your full name"
					autoComplete="name"
				/>
				{errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
			</div>

			<div>
				<p className="text-xs text-neutral-500 mb-2">Email</p>
				<Input
					{...register('email')}
					type="email"
					placeholder="Your email"
					autoComplete="email"
				/>
				{errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
			</div>

			<div>
				<p className="text-xs text-neutral-500 mb-2">Mobile Number</p>
				<Input
					{...register('mobile', {
						onChange: (e) => {
							const onlyDigits = (e.target.value as string).replace(/\D/g, '').slice(0, 10)
							e.target.value = onlyDigits
							setValue('mobile', onlyDigits, { shouldValidate: true, shouldDirty: true })
						},
					})}
					placeholder="10-digit mobile number"
					inputMode="numeric"
					pattern="[0-9]{10}"
					title="Enter exactly 10 digits"
					maxLength={10}
				/>
				{errors.mobile && <p className="mt-2 text-sm text-red-600">{errors.mobile.message}</p>}
			</div>

			<div>
				<p className="text-xs text-neutral-500 mb-2">Address</p>
				<Input
					{...register('address')}
					placeholder="Your address"
				/>
				{errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
			</div>

			<div>
				<p className="text-xs text-neutral-500 mb-2">Interest Field</p>
				<Input
					{...register('interestField')}
					placeholder="e.g., IAS, Design, Data Science"
				/>
				{errors.interestField && <p className="mt-2 text-sm text-red-600">{errors.interestField.message}</p>}
			</div>

			<div>
				<p className="text-xs text-neutral-500 mb-2">Bio</p>
				<textarea
					{...register('bio')}
					rows={4}
					className="flex w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
					placeholder="Tell us about yourself"
				/>
				{errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>}
			</div>

			<div>
				<p className="text-xs text-neutral-500 mb-2">Skills (comma-separated)</p>
				<Input
					{...register('skills')}
					placeholder="e.g., Communication, Leadership, Writing"
				/>
				{errors.skills && <p className="mt-2 text-sm text-red-600">{errors.skills.message}</p>}
			</div>

			<div className="flex items-center gap-3">
				<Button type="submit" disabled={submitting}>
					{submitting ? 'Saving...' : 'Save Changes'}
				</Button>
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
						Cancel
					</Button>
				)}
			</div>

			<div className="pt-4">
				<p className="text-xs text-neutral-500">
					All fields are required. Skills should be comma-separated.
				</p>
			</div>
				</CardContent>
			</Card>
		</form>
	)
}


