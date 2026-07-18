'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function uploadFile(formData: FormData): Promise<{
  url?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return { error: 'No file provided' };
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'File size exceeds 5MB limit' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = file.name.split('.').pop() || '';
    const filename = `${randomUUID()}.${ext}`;
    
    // Ensure the uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      // Ignore if directory already exists
    }

    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    return { url: `/uploads/${filename}` };
  } catch (error) {
    console.error('UPLOAD_FILE_ERROR:', error);
    return { error: 'Failed to upload file' };
  }
}
