export interface SignUpResponse {
  id: number;
  name: string | null; // Add null as possible type since Prisma schema allows it
  email: string;
}
