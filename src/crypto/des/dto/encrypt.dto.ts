import { IsString, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EncryptDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Texto a ser criptografado",
    example: "TextoSecreto123",
  })
  text: string;

  @IsString()
  @Matches(/^[0-9A-F]{16}$/, {
    message:
      "A chave deve conter exatamente 16 caracteres hexadecimais (0-9, A-F)",
  })
  @ApiProperty({
    description: "Chave de criptografia DES (16 caracteres hexadecimais)",
    example: "0123456789ABCDEF",
  })
  key: string;
}
