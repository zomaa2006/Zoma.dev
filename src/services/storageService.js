// ─── Firebase Storage — used for PDFs (certificates & CV) ──────────────────
// Firebase Storage download URLs include a token, making them publicly
// accessible without any auth rules changes. Cloudinary is kept for images.
// ───────────────────────────────────────────────────────────────────────────

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a PDF to Firebase Storage with real-time progress.
 * @param {File} file
 * @param {object} options
 * @param {string} options.folder - e.g. 'certificates' | 'cv'
 * @param {function} options.onProgress - Called with (percent)
 * @returns {Promise<string>} - Public download URL
 */
export function uploadPdfToStorage(file, { folder = 'pdfs', onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const safeName  = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `${folder}/${timestamp}_${safeName}`);

    const task = uploadBytesResumable(storageRef, file, {
      contentType: 'application/pdf',
    });

    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        if (onProgress) onProgress(pct);
      },
      (err) => reject(new Error(err.message || 'Storage upload failed')),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}
