import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type Role = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  premium: boolean;
  createdAt: string;
}

const USERS_KEY = 'app_users';
const SESSION_KEY = 'app_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {
    this.seed();
  }

  private seed(): void {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const seeded: User[] = [
        {
          id: 1,
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          premium: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Demo User',
          email: 'user@example.com',
          password: 'user123',
          role: 'user',
          premium: false,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
    }
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  register(name: string, email: string, password: string, role: Role = 'user'): { ok: boolean; message: string } {
    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'Email already registered' };
    }
    const user: User = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      premium: false,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    this.saveUsers(users);
    return { ok: true, message: 'Registered successfully' };
  }

  login(email: string, password: string): { ok: boolean; message: string; user?: User } {
    const user = this.getUsers().find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, message: 'Invalid email or password' };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id }));
    return { ok: true, message: 'Login successful', user };
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.router.navigate(['/login']);
  }

  currentUser(): User | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { id } = JSON.parse(raw);
    return this.getUsers().find(u => u.id === id) || null;
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }
}
