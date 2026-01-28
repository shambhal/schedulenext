import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export interface UserInfo {
  id: number;
  email: string;
  phone: string;
  name: string;
  token?: string;
  access_token?: string;
  refresh_token?: string;
}