// 📁 Caminho sugerido: backend/src/presentation/auth.module.ts
import { Module } from '@nestjs/common';
import { ITokenService } from '../application/ports/ITokenService.js';
import { JwtTokenService } from '../infrastructure/auth/jwt-token.service.js';
import { AuthController } from './auth.controller.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: ITokenService,
      useClass: JwtTokenService,
    },
    JwtAuthGuard,
  ],
  exports: [ITokenService, JwtAuthGuard],
})
export class AuthModule {}