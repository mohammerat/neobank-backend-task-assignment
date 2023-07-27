export interface IUser {
  id: number;
  name: string;
  family: string;
  mobile: string;
  age: number;
  gender: string;
  registeredAt?: Date | null;
  bannedAt?: Date | null;
  bannedUntil?: Date | null;
}
