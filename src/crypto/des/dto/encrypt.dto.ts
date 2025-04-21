import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EncryptDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Texto a ser criptografado',
    example: 'TextoSecreto123',
    examples: {
      exemplo1: {
        summary: 'Texto curto',
        value: 'Secreto',
      },
      exemplo2: {
        summary: 'Texto maior',
        value: 'Este é um texto confidencial para teste do algoritmo DES',
      },
    },
  })
  text: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9A-F]{16}$/, {
    message:
      'A chave deve conter exatamente 16 caracteres hexadecimais (0-9, A-F)',
  })
  @ApiProperty({
    description: 'Chave de criptografia DES (16 caracteres hexadecimais)',
    example: '0123456789ABCDEF',
    required: false,
    examples: {
      exemplo1: {
        summary: 'Chave padrão',
        value: '0123456789ABCDEF',
      },
      exemplo2: {
        summary: 'Chave personalizada',
        value: 'FEDCBA9876543210',
      },
    },
  })
  key?: string;
}
