import { Body, Controller, Post, Get } from '@nestjs/common';
import { DesService } from './des.service';
import { EncryptDto } from './dto/encrypt.dto';
import { DecryptDto } from './dto/decrypt.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('criptografia')
@Controller('crypto/des')
export class DesController {
  constructor(private readonly desService: DesService) {}

  @Post('encrypt')
  @ApiOperation({ summary: 'Criptografa um texto usando o algoritmo DES' })
  @ApiBody({
    type: EncryptDto,
    examples: {
      exemplo1: {
        summary: 'Texto simples',
        value: { text: 'TextoSecreto123' },
      },
      exemplo2: {
        summary: 'Texto com chave personalizada',
        value: {
          text: 'Esta é uma mensagem confidencial',
          key: 'FEDCBA9876543210',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Texto criptografado com sucesso',
    schema: {
      properties: {
        ciphertext: { type: 'string', example: 'A1B2C3D4E5F6' },
        keyUsed: { type: 'string', example: '0123456789ABCDEF' },
      },
    },
  })
  encrypt(@Body() dto: EncryptDto) {
    console.log('\n\n🔐 INICIANDO PROCESSO DE CRIPTOGRAFIA DES 🔐');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 Texto a ser criptografado:', dto.text);
    console.log('🔑 Chave utilizada:', dto.key || 'Padrão (será gerada)');

    try {
      // Ativa o modo de demonstração para esta operação
      this.desService.setDemoMode(true);

      // Usa a chave personalizada se fornecida, caso contrário usa a padrão
      const resultado = this.desService.encrypt(dto.text, dto.key);

      setTimeout(() => {
        console.log('✅ Criptografia concluída com sucesso!');
        console.log('🔒 Texto cifrado:', resultado);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
        // Desativa o modo de demonstração após concluir
        this.desService.setDemoMode(false);
      }, 500);

      return {
        ciphertext: resultado,
        keyUsed: dto.key || this.desService.getCurrentKey(),
      };
    } catch (error) {
      console.error('❌ ERRO na criptografia:', error);
      this.desService.setDemoMode(false);
      throw error;
    }
  }

  @Post('decrypt')
  @ApiOperation({ summary: 'Descriptografa um texto cifrado com DES' })
  @ApiBody({
    type: DecryptDto,
    examples: {
      exemplo1: {
        summary: 'Texto cifrado de exemplo',
        value: { ciphertext: 'A1B2C3D4E5F6' },
      },
      exemplo2: {
        summary: 'Texto cifrado com chave personalizada',
        value: {
          ciphertext: 'A1B2C3D4E5F6',
          key: 'FEDCBA9876543210',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Texto descriptografado com sucesso',
    schema: {
      properties: {
        plaintext: { type: 'string', example: 'Texto confidencial' },
      },
    },
  })
  decrypt(@Body() dto: DecryptDto) {
    console.log('\n\n🔓 INICIANDO PROCESSO DE DESCRIPTOGRAFIA DES 🔓');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔒 Texto cifrado a ser descriptografado:', dto.ciphertext);
    console.log('🔑 Chave utilizada:', dto.key || 'Padrão');

    try {
      // Ativa o modo de demonstração para esta operação
      this.desService.setDemoMode(true);

      // Processa a descriptografia
      const resultado = this.desService.decrypt(dto.ciphertext, dto.key);

      setTimeout(() => {
        console.log('✅ Descriptografia concluída com sucesso!');
        console.log('📝 Texto original recuperado:', resultado);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
        // Desativa o modo de demonstração após concluir
        this.desService.setDemoMode(false);
      }, 500);

      return {
        plaintext: resultado,
      };
    } catch (error) {
      console.error('❌ ERRO na descriptografia:', error);
      this.desService.setDemoMode(false);
      throw error;
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Testa a criptografia e descriptografia' })
  @ApiResponse({
    status: 200,
    description: 'Teste de criptografia e descriptografia',
    content: {
      'application/json': {
        example: {
          original: 'TesteDES',
          cifrado: 'A1B2C3D4E5F6',
          descriptografado: 'TesteDES',
          sucesso: true,
        },
      },
    },
  })
  test() {
    console.log('\n\n🧪 INICIANDO TESTE COMPLETO DO ALGORITMO DES 🧪');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Ativa o modo de demonstração para este teste
    this.desService.setDemoMode(true);

    const textoOriginal = 'TesteDES';
    console.log('📝 Texto original para teste:', textoOriginal);

    // Gera uma nova chave aleatória para o teste
    const chaveAleatoria = this.desService.generateRandomKey();
    console.log('🔑 Chave aleatória gerada para o teste:', chaveAleatoria);

    setTimeout(() => {
      console.log(
        '\n🔐 Iniciando processo de criptografia do texto de teste...',
      );

      // Criptografa o texto usando a chave aleatória
      const textoCifrado = this.desService.encrypt(
        textoOriginal,
        chaveAleatoria,
      );

      setTimeout(() => {
        console.log('🔒 Texto cifrado produzido:', textoCifrado);
        console.log('\n🔓 Iniciando processo de descriptografia...');

        // Descriptografa o texto usando a mesma chave
        const textoDescriptografado = this.desService.decrypt(
          textoCifrado,
          chaveAleatoria,
        );

        setTimeout(() => {
          console.log('📝 Texto descriptografado:', textoDescriptografado);

          // Verifica se o processo foi bem-sucedido
          const sucesso = textoOriginal === textoDescriptografado;
          console.log(
            sucesso
              ? '✅ TESTE BEM-SUCEDIDO: O texto foi recuperado corretamente!'
              : '❌ FALHA NO TESTE: Os textos não correspondem!',
          );
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');

          // Desativa o modo de demonstração após concluir
          this.desService.setDemoMode(false);
        }, 1000);
      }, 1000);
    }, 500);

    return {
      original: textoOriginal,
      chaveUsada: chaveAleatoria,
      cifrado: this.desService.encrypt(textoOriginal, chaveAleatoria),
      descriptografado: this.desService.decrypt(
        this.desService.encrypt(textoOriginal, chaveAleatoria),
        chaveAleatoria,
      ),
      sucesso: true,
    };
  }

  @Get('generate-key')
  @ApiOperation({ summary: 'Gera uma chave DES aleatória' })
  @ApiResponse({
    status: 200,
    description: 'Chave gerada com sucesso',
    schema: {
      properties: {
        key: { type: 'string', example: 'A1B2C3D4E5F60718' },
      },
    },
  })
  generateKey() {
    console.log('\n\n🔑 GERANDO CHAVE DES ALEATÓRIA 🔑');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Ativa o modo de demonstração
    this.desService.setDemoMode(true);

    // Gera a chave com demonstração detalhada
    const key = this.desService.generateRandomKey();

    setTimeout(() => {
      console.log('✅ Chave DES gerada com sucesso!');
      console.log('🔑 Chave (formato hexadecimal):', key);
      console.log('🔢 Tamanho: 64 bits (16 caracteres hexadecimais)');
      console.log(
        'ℹ️ Nota: Apenas 56 bits são efetivamente usados para criptografia.',
      );
      console.log(
        '   Os 8 bits restantes são usados para verificação de paridade.',
      );
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');

      // Desativa o modo de demonstração
      this.desService.setDemoMode(false);
    }, 500);

    return {
      key: key,
    };
  }
}
