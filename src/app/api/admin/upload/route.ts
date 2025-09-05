import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configurações de upload
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'livros');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Função para gerar nome único do arquivo
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}

// Função para validar arquivo
function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Arquivo muito grande. Máximo 5MB.' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.' };
  }

  return { valid: true };
}

// POST - Upload de imagem
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tipo = formData.get('tipo') as string; // 'front' ou 'back'

    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nenhum arquivo enviado'
        },
        { status: 400 }
      );
    }

    if (!tipo || !['front', 'back'].includes(tipo)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tipo de imagem inválido. Use "front" ou "back".'
        },
        { status: 400 }
      );
    }

    // Validar arquivo
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error
        },
        { status: 400 }
      );
    }

    // Criar diretório se não existir
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const fileName = generateUniqueFileName(file.name);
    const filePath = join(UPLOAD_DIR, fileName);

    // Converter arquivo para buffer e salvar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retornar URL da imagem
    const imageUrl = `/uploads/livros/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// DELETE - Remover imagem
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nome do arquivo não fornecido'
        },
        { status: 400 }
      );
    }

    const { unlink } = await import('fs/promises');
    const filePath = join(UPLOAD_DIR, fileName);

    // Verificar se arquivo existe
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Arquivo não encontrado'
        },
        { status: 404 }
      );
    }

    // Remover arquivo
    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Arquivo removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover arquivo:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao remover arquivo',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
