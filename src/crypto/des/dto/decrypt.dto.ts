import { IsString, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DecryptDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Texto cifrado a ser descriptografado",
    example: "A1B2C3D4E5F6",
  })
  ciphertext: string;

  @IsString()
  @Matches(/^[0-9A-F]{16}$/, {
    message:
      "A chave deve conter exatamente 16 caracteres hexadecimais (0-9, A-F)",
  })
  @ApiProperty({
    description: "Chave de descriptografia DES (16 caracteres hexadecimais)",
    example: "0123456789ABCDEF",
  })
  key: string;
}
