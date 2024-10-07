import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();
  
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('barber-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    return data.path;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}