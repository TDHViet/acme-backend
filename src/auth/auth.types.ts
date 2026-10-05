export interface JwtPayload {
  sub: number;
  email: string;
}

/** Attached to `request.user` by JwtAuthGuard. */
export interface AuthUser {
  id: number;
  email: string;
}
