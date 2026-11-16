import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './presentation/auth.module.js';
import { ReceitaModule } from './presentation/receita.module.js';

@Module({
  imports: [AuthModule, ReceitaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
