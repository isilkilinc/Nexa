'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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

    if (!supabaseUrl || !supabaseKey) {
      return { error: 'Supabase credentials are not configured' };
    }

    const ext = file.name.split('.').pop() || '';
    const filename = `${randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('chat-media')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('SUPABASE_UPLOAD_ERROR:', error);
      return { error: 'Failed to upload to storage' };
    }

    const { data: publicUrlData } = supabase.storage
      .from('chat-media')
      .getPublicUrl(filename);

    return { url: publicUrlData.publicUrl };
  } catch (error) {
    console.error('UPLOAD_FILE_ERROR:', error);
    return { error: 'Failed to upload file' };
  }
}
