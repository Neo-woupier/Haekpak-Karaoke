// frontend/src/utils/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createBrowserClient(supabaseUrl, supabaseKey);
};

export const uploadPaymentSlip = async (file: File): Promise<string | null> => {
  try {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `slip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-slips')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('Upload Error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage
      .from('payment-slips')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error('Failed to upload payment slip:', err);
    return null;
  }
};