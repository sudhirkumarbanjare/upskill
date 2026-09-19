// ─── Firebase: Storage Helpers ───
// Upload/download helpers for avatars, logos, and course content.

import {storage} from './config';

export interface UploadResult {
  downloadUrl: string;
  fullPath: string;
}

/**
 * Upload a file to Firebase Storage.
 * @param path - Storage path (e.g., 'avatars/uid123/profile.jpg')
 * @param localUri - Local file URI (e.g., from image picker)
 * @param onProgress - Optional progress callback (0-100)
 */
export async function uploadFile(
  path: string,
  localUri: string,
  onProgress?: (progress: number) => void,
): Promise<UploadResult> {
  const reference = storage().ref(path);
  const task = reference.putFile(localUri);

  if (onProgress) {
    task.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(Math.round(progress));
    });
  }

  await task;
  const downloadUrl = await reference.getDownloadURL();

  return {
    downloadUrl,
    fullPath: reference.fullPath,
  };
}

/**
 * Upload user avatar.
 */
export async function uploadAvatar(
  uid: string,
  localUri: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const result = await uploadFile(
    `avatars/${uid}/profile.jpg`,
    localUri,
    onProgress,
  );
  return result.downloadUrl;
}

/**
 * Upload company logo.
 */
export async function uploadCompanyLogo(
  uid: string,
  localUri: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const result = await uploadFile(
    `company-logos/${uid}/logo.jpg`,
    localUri,
    onProgress,
  );
  return result.downloadUrl;
}

/**
 * Upload course thumbnail.
 */
export async function uploadCourseThumbnail(
  courseId: string,
  localUri: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const result = await uploadFile(
    `courses/${courseId}/thumbnail.jpg`,
    localUri,
    onProgress,
  );
  return result.downloadUrl;
}

/**
 * Delete a file from Firebase Storage.
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    await storage().ref(path).delete();
  } catch (error: any) {
    // Silently ignore 'object-not-found' errors
    if (error?.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}
