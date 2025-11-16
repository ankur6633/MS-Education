'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

type AvatarUploaderProps = {
	initialUrl?: string
	onUploaded: (url: string) => void
}

export default function AvatarUploader({ initialUrl, onUploaded }: AvatarUploaderProps) {
	const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl)
	const [isUploading, setIsUploading] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)

	const openFileDialog = () => {
		inputRef.current?.click()
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// Basic client-side checks
		if (!file.type.startsWith('image/')) {
			alert('Please select an image file')
			return
		}
		if (file.size > 5 * 1024 * 1024) {
			alert('Image must be 5MB or smaller')
			return
		}

		setIsUploading(true)
		try {
			const formData = new FormData()
			formData.append('file', file)
			formData.append('folder', 'mseducation/avatars')

			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			if (!res.ok) {
				throw new Error('Upload failed')
			}

			const data = await res.json()
			const url: string = data.url
			setPreviewUrl(url)
			onUploaded(url)
		} catch (err) {
			console.error('Avatar upload error:', err)
			alert('Failed to upload avatar. Please try again.')
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className="flex items-center space-x-4">
			<div className="relative h-20 w-20 rounded-full overflow-hidden border bg-neutral-100">
				{previewUrl ? (
					<Image src={previewUrl} alt="Avatar" fill sizes="80px" className="object-cover" />
				) : (
					<div className="h-full w-full flex items-center justify-center text-neutral-500">IMG</div>
				)}
			</div>
			<div>
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFileChange}
					disabled={isUploading}
				/>
				<Button type="button" onClick={openFileDialog} disabled={isUploading}>
					{isUploading ? 'Uploading...' : 'Upload Avatar'}
				</Button>
			</div>
		</div>
	)
}


