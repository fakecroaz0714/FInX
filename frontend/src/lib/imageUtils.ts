/**
 * Utility functions for validating, compressing, and handling
 * impact proof image uploads in FINX.
 */

export interface ImageValidationResult {
    valid: boolean;
    error?: string;
}

export interface CompressedImageResult {
    dataUrl: string;
    width: number;
    height: number;
    compressedSize: number; // approximate size in bytes
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

/**
 * Validates file size and format against strict image requirements.
 */
export function validateImageFile(file: File): ImageValidationResult {
    if (!file) {
        return { valid: false, error: 'No file selected.' };
    }

    // 1. File size check (10 MB max)
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'Image must be smaller than 10 MB.' };
    }

    // 2. MIME type check
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        return { valid: false, error: 'Please upload a JPG, PNG, or WEBP image.' };
    }

    // 3. Extension check
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some(ext => fileNameLower.endsWith(ext));
    if (!hasValidExt) {
        return { valid: false, error: 'Please upload a JPG, PNG, or WEBP image.' };
    }

    return { valid: true };
}

/**
 * Resizes and compresses an image client-side to prevent localStorage quota exhaustion.
 * Downscales images exceeding maxWidth/maxHeight and outputs an optimized JPEG or WEBP Data URL.
 */
export function compressImage(
    file: File,
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82
): Promise<CompressedImageResult> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Scale down dimensions while maintaining aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    if (width / height > maxWidth / maxHeight) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        maxHeight = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas 2D context unavailable'));
                    return;
                }

                // Smooth resizing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Use original MIME if WebP, otherwise JPEG for maximum compression efficiency
                const outputType = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
                const dataUrl = canvas.toDataURL(outputType, quality);

                // Estimate approximate byte size of base64
                const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
                const compressedSize = Math.round((base64Length * 3) / 4);

                resolve({
                    dataUrl,
                    width,
                    height,
                    compressedSize
                });
            };

            img.onerror = () => {
                reject(new Error('Failed to load image for compression.'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file from disk.'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Helper to display human-readable byte sizes (e.g. "850 KB" or "2.4 MB")
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
