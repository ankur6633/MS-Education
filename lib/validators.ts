import { z } from 'zod'

export const waitlistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['Student', 'Professional', 'Campus', 'Recruiter'], {
    required_error: 'Please select your role',
  }),
})

export type WaitlistFormData = z.infer<typeof waitlistSchema>
