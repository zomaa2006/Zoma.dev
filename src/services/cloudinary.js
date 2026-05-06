// ─── Cloudinary Upload Service ─────────────────────────────────────────────
// Uses UNSIGNED upload preset — completely safe to use in frontend code.
// API Secret is NEVER used here. Only cloud name + preset name.
// ───────────────────────────────────────────────────────────────────────────

const CLOUD_NAME = 'dwxvndeqw';
const UPLOAD_PRESET = 'portfolio_uploads'; // Must be set to "Unsigned" in Cloudinary dashboard

/**
 * Upload a file to Cloudinary with real-time progress callbacks.
 * @param {File} file - The file to upload
 * @param {object} options
 * @param {string} options.folder - Cloudinary folder (e.g. 'certificates', 'projects', 'cv')
 * @param {function} options.onProgress - Called with (percent) during upload
 * @returns {Promise<string>} - Resolves to the secure URL of the uploaded file
 */
export function uploadToCloudinary(file, { folder = 'portfolio', onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    // Detect resource type
    const isPdf = file.type === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'image';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);

    // Real-time progress
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        const err = JSON.parse(xhr.responseText);
        reject(new Error(err.error?.message || 'Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}
