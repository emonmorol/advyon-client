import { z } from 'zod';

/**
 * WBS-1.4 — Shared Zod schemas for auth and onboarding forms.
 * These mirror server-side AuthValidation schemas to ensure parity.
 */

// ─── Login / Sign-In ────────────────────────────────────────────────
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

// ─── Client Profile (onboarding) ────────────────────────────────────
const clientProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name is too long'),
    phone: z
        .string()
        .min(6, 'Phone number is too short')
        .max(20, 'Phone number is too long')
        .optional(),
    address: z
        .string()
        .max(250, 'Address is too long')
        .optional(),
});

// ─── Lawyer Profile (onboarding) ────────────────────────────────────
const lawyerProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name is too long'),
    barRegistrationNumber: z
        .string()
        .min(1, 'Bar registration number is required'),
    barCouncilName: z
        .string()
        .min(1, 'Bar council name is required'),
    yearsOfExperience: z
        .number({ invalid_type_error: 'Must be a number' })
        .int()
        .min(0, 'Cannot be negative')
        .max(60, 'Value too large')
        .optional(),
    primaryPracticeArea: z
        .string()
        .min(1, 'Practice area is required')
        .optional(),
});

// ─── Judge Profile (onboarding) ─────────────────────────────────────
const judgeProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name is too long'),
    courtName: z
        .string()
        .min(1, 'Court name is required'),
    designation: z
        .string()
        .min(1, 'Designation is required'),
});

// ─── Onboarding (role-discriminated) ────────────────────────────────
export const onboardingSchema = z.discriminatedUnion('role', [
    z.object({ role: z.literal('client'), profile: clientProfileSchema }),
    z.object({ role: z.literal('lawyer'), profile: lawyerProfileSchema }),
    z.object({ role: z.literal('judge'), profile: judgeProfileSchema }),
]);

// ─── Profile Update ─────────────────────────────────────────────────
export const profileUpdateSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name is too long')
        .optional(),
    displayName: z
        .string()
        .max(50, 'Display name is too long')
        .optional(),
    preferredLanguage: z
        .enum(['en', 'bn'], { errorMap: () => ({ message: 'Select a valid language' }) })
        .optional(),
    timezone: z
        .string()
        .optional(),
});

// ─── Validation helper ──────────────────────────────────────────────
/**
 * Validate form data against a schema and return field-level errors.
 * @param {z.ZodSchema} schema
 * @param {object} data
 * @returns {{ success: boolean, errors: Record<string, string> }}
 */
export const validateForm = (schema, data) => {
    const result = schema.safeParse(data);
    if (result.success) return { success: true, errors: {} };

    const errors = {};
    for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    }
    return { success: false, errors };
};
