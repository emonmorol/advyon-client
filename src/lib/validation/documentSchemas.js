import { z } from 'zod';

/**
 * WBS-1.4 — Shared Zod schemas for document forms.
 * These mirror server-side DocumentValidation to ensure client-server parity.
 */

// Allowed MIME types for document upload
export const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
];

// Max file size: 50MB
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

// Allowed folder names
export const FOLDER_NAMES = [
    'Evidence',
    'Legal Documents',
    'Court Orders',
    'Correspondence',
    'Contracts',
    'Financial',
    'Affidavits',
    'Other',
];

// ─── Document Upload ────────────────────────────────────────────────
export const documentUploadSchema = z.object({
    folderName: z
        .string()
        .min(1, 'Folder name is required')
        .refine((val) => FOLDER_NAMES.includes(val), {
            message: 'Please select a valid folder',
        }),
    file: z
        .any()
        .refine((file) => file instanceof File, 'A file is required')
        .refine(
            (file) => file instanceof File && file.size <= MAX_FILE_SIZE_BYTES,
            `File must be smaller than ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`
        )
        .refine(
            (file) => file instanceof File && ALLOWED_MIME_TYPES.includes(file.type),
            'File type not supported. Please upload PDF, DOCX, image, or text files.'
        ),
});

// ─── Document Filter / Query ────────────────────────────────────────
export const documentQuerySchema = z.object({
    folder: z.string().optional(),
    search: z
        .string()
        .max(200, 'Search query is too long')
        .optional(),
    category: z.string().optional(),
    processingStatus: z
        .enum(['pending', 'processing', 'completed', 'failed'])
        .optional(),
    sortBy: z
        .enum(['date', 'name', 'size', 'status'])
        .optional()
        .default('date'),
    sortOrder: z
        .enum(['asc', 'desc'])
        .optional()
        .default('desc'),
});

// ─── Folder Name (standalone) ───────────────────────────────────────
export const folderNameSchema = z.object({
    folderName: z
        .string()
        .min(1, 'Folder name is required')
        .max(50, 'Folder name is too long')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Folder name contains invalid characters'),
});
