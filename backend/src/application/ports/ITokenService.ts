export interface TokenPayload {
  sub: string;
  email: string;
}
export abstract class ITokenService {
  abstract gerarToken(payload: TokenPayload): Promise<string>;
  abstract verificarToken(token: string): Promise<TokenPayload>;
}