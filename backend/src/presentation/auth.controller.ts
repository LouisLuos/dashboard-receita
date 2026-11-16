// 📁 Caminho sugerido: backend/src/presentation/auth.controller.ts
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import { ITokenService } from '../application/ports/ITokenService.js';

interface LoginBody {
  email?: string;
  senha?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly tokenService: ITokenService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginBody): Promise<{ accessToken: string }> {
    const emailEsperado = process.env.AUTH_GESTOR_EMAIL;
    const senhaEsperada = process.env.AUTH_GESTOR_PASSWORD;

    if (!emailEsperado || !senhaEsperada) {
      throw new Error('Credenciais do gestor não configuradas no ambiente.');
    }

    const emailInformado = body?.email?.trim() ?? '';
    const senhaInformada = body?.senha ?? '';

    const emailValido = this.compararSeguro(emailInformado, emailEsperado);
    const senhaValida = this.compararSeguro(senhaInformada, senhaEsperada);

    if (!emailValido || !senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const accessToken = await this.tokenService.gerarToken({
      sub: 'gestor-financeiro',
      email: emailEsperado,
    });

    return { accessToken };
  }

  private compararSeguro(a: string, b: string): boolean {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  }
}