// 📁 Caminho sugerido: backend/src/infrastructure/auth/jwt-token.service.ts
import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import {
  ITokenService,
  type TokenPayload,
} from '../../application/ports/ITokenService.js';

@Injectable()
export class JwtTokenService extends ITokenService {
  private readonly secret: string;
  private readonly expiresIn = '8h';

  constructor() {
    super();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Fail-fast: impede a API de subir em produção sem segredo configurado
      throw new Error('Variável de ambiente JWT_SECRET não definida.');
    }
    this.secret = secret;
  }

  async gerarToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  async verificarToken(token: string): Promise<TokenPayload> {
    const decoded = jwt.verify(token, this.secret);

    if (
      typeof decoded === 'string' ||
      !decoded ||
      typeof decoded.sub !== 'string' ||
      typeof decoded.email !== 'string'
    ) {
      throw new Error('Payload do token inválido.');
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
    };
  }
}