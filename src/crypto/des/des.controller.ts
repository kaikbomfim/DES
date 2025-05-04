import { Body, Controller, Post, Get } from "@nestjs/common";
import { DesService } from "./des.service";
import { EncryptDto } from "./dto/encrypt.dto";
import { DecryptDto } from "./dto/decrypt.dto";
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from "@nestjs/swagger";

@ApiTags("criptografia")
@Controller("crypto/des")
export class DesController {
  constructor(private readonly desService: DesService) {}

  @Post("encrypt")
  @ApiOperation({ summary: "Criptografa um texto usando o algoritmo DES" })
  @ApiBody({ type: EncryptDto })
  @ApiResponse({
    status: 200,
    description: "Texto criptografado com sucesso",
    schema: {
      properties: {
        ciphertext: { type: "string", example: "A1B2C3D4E5F6" },
        key: { type: "string", example: "0123456789ABCDEF" },
      },
    },
  })
  encrypt(@Body() dto: EncryptDto) {
    const result = this.desService.encrypt(dto.text, dto.key);
    return {
      ciphertext: result,
      key: dto.key,
    };
  }

  @Post("decrypt")
  @ApiOperation({ summary: "Descriptografa um texto cifrado com DES" })
  @ApiBody({ type: DecryptDto })
  @ApiResponse({
    status: 201,
    description: "Texto descriptografado com sucesso",
    schema: {
      properties: {
        plaintext: { type: "string", example: "Texto confidencial" },
      },
    },
  })
  decrypt(@Body() dto: DecryptDto) {
    const result = this.desService.decrypt(dto.ciphertext, dto.key);
    return {
      plaintext: result,
    };
  }

  @Get("generate-key")
  @ApiOperation({ summary: "Gera uma chave DES aleatória" })
  @ApiResponse({
    status: 200,
    description: "Chave gerada com sucesso",
    schema: {
      properties: {
        key: { type: "string", example: "A1B2C3D4E5F60718" },
      },
    },
  })
  generateKey() {
    const key = this.desService.generateRandomKey();
    return {
      key: key,
    };
  }
}
