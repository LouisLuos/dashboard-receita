import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ReceitaModule } from './presentation/receita.module.js';

@Module({
  imports: [ReceitaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
