import { z } from 'zod'

const optionalStr = (max: number, msg: string) =>
	z
		.string()
		.max(max, msg)
		.optional()
		.or(z.literal(''))
		.transform((v) => (v === '' ? undefined : v))

export const profileUpdateSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	email: z.string().email('Please enter a valid email'),
	mobile: z
		.string()
		.min(10, 'Enter 10-digit mobile number')
		.max(10, 'Enter 10-digit mobile number')
		.regex(/^\d{10}$/, 'Enter only digits'),
	address: optionalStr(300, 'Address is too long'),
  interestField: optionalStr(100, 'Too long'),
  // New: support multiple interests
  interests: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (v === '' ? [] : v)),
	bio: optionalStr(500, 'Bio is too long'),
	// Allow empty or omitted; API will normalize string to array
	skills: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.transform((v) => (v === '' ? [] : v)),
	profileImage: z.string().url('Invalid image URL').optional(),
})

export type ProfileUpdatePayload = z.infer<typeof profileUpdateSchema>


