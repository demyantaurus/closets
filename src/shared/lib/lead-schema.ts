import { z } from 'zod'

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{9,20}$/, 'Укажите корректный номер телефона')

export const leadSchema = z.object({
  type: z.enum(['callback', 'calculator', 'project3d', 'contact']),
  name: z.string().trim().min(2, 'Укажите имя').max(100),
  phone: phoneSchema,
  message: z.string().trim().max(2000).optional(),
  details: z.record(z.string(), z.unknown()).optional(),
  company: z.string().max(0).optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
