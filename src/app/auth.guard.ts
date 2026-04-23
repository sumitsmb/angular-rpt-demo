import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }
    const requiredRole = route.data?.['role'];
    if (requiredRole && user.role !== requiredRole) {
      this.router.navigate([user.role === 'admin' ? '/admin' : '/dashboard']);
      return false;
    }
    return true;
  }
}
