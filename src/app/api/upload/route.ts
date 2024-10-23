import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import ossClient from '@/utils/ossClient';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueFilename = `uploads/${uuidv4()}${file.name.substring(file.name.lastIndexOf('.'))}`;

    const result = await ossClient.put(uniqueFilename, buffer);

    if (result.res.status === 200) {
      return NextResponse.json({ success: true, filepath: result.url });
    } else {
      throw new Error('Upload to OSS failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'File upload failed' });
  }
}
