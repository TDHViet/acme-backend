import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test' = 'development';

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @MinLength(32, {
    message: 'JWT_SECRET must be at least 32 characters (use `openssl rand -base64 48`)',
  })
  JWT_SECRET: string;

  /** Any value accepted by `jsonwebtoken`'s expiresIn, e.g. `15m`, `1h`, `7d`. */
  @IsString()
  JWT_EXPIRES_IN: string = '1h';

  @IsInt()
  @Min(10)
  @Max(14)
  BCRYPT_ROUNDS: number = 12;

  /** Comma-separated list of allowed CORS origins, e.g. `http://localhost:5173,https://acme.app`. */
  @IsString()
  @IsNotEmpty()
  FRONTEND_URL: string;
}

export type Env = Omit<EnvironmentVariables, 'FRONTEND_URL'> & {
  /** Normalized to `scheme://host[:port]`. */
  FRONTEND_URL: string[];
};

function parseOrigins(value: string) {
  const origins: string[] = [];
  const invalid: string[] = [];
  for (const raw of value
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)) {
    try {
      origins.push(new URL(raw).origin);
    } catch {
      invalid.push(raw);
    }
  }
  return { origins, invalid };
}

export function validateEnv(config: Record<string, unknown>): Env {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const messages = validateSync(validated).flatMap(e => Object.values(e.constraints ?? {}));

  const { origins, invalid } = parseOrigins(validated.FRONTEND_URL ?? '');
  if (invalid.length > 0)
    messages.push(`FRONTEND_URL contains invalid URLs: ${invalid.join(', ')}`);

  if (messages.length > 0) {
    throw new Error(`Invalid environment variables:\n  - ${messages.join('\n  - ')}`);
  }
  return { ...validated, FRONTEND_URL: origins };
}
