import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  surname: z
    .string()
    .min(1, 'Surname is required')
    .max(100, 'Surname must be less than 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export const generationSchema = z.object({
  topic: z
    .string()
    .min(1, 'Topic is required')
    .max(200, 'Topic must be less than 200 characters'),
  platform: z.enum(['twitter', 'linkedin', 'instagram', 'blog'], {
    required_error: 'Please select a platform',
  }),
  tone: z.enum(['professional', 'casual', 'playful', 'authoritative'], {
    required_error: 'Please select a tone',
  }),
  imageCount: z
    .number()
    .min(1, 'Must generate at least 1 image')
    .max(4, 'Cannot generate more than 4 images')
    .optional()
    .default(1),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type GenerationFormData = z.infer<typeof generationSchema>;