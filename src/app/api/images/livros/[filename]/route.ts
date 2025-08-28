import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const imagePath = join(process.cwd(), 'public', 'images', 'livros', filename);
    
    // Verificar se o arquivo existe
    const imageBuffer = readFileSync(imagePath);
    
    // Determinar o tipo MIME baseado na extensão
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg';
    
    if (ext === 'png') {
      contentType = 'image/png';
    } else if (ext === 'gif') {
      contentType = 'image/gif';
    } else if (ext === 'webp') {
      contentType = 'image/webp';
    }
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Erro ao servir imagem:', error);
    return new NextResponse('Imagem não encontrada', { status: 404 });
  }
}
