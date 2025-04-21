import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Criptografia DES')
    .setDescription(
      'Implementação do algoritmo DES para fins educacionais. Conteúdo avaliativo para a disciplina de Segurança de Redes de Computadores do IFBA.',
    )
    .setVersion('1.0')
    .addTag('criptografia')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
