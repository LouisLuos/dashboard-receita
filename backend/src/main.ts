import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  app.setGlobalPrefix('api/v1')

  app.enableCors({
    origin: ["http://localhost:5173",
      "https://dashboard-receita-tau.vercel.app"],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true 
  })

  await app.listen(port, '0.0.0.0')
  console.log(`Rodando na porta ${port}`)
}
bootstrap();
