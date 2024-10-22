import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 确保上传目录存在
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 使用 uuid 生成唯一的文件名
  const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
  const filepath = path.join(uploadDir, uniqueFilename);

  try {
    fs.writeFileSync(filepath, buffer);
    return NextResponse.json({ success: true, filepath: `/uploads/${uniqueFilename}` });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false });
  }
}
