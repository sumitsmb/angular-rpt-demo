import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Role } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.shared.css'],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role: Role = 'user';
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    this.success = '';
    if (!this.name || !this.email || !this.password) {
      this.error = 'All fields are required';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }
    this.loading = true;
    const r = this.auth.register(this.name.trim(), this.email.trim(), this.password, this.role);
    this.loading = false;
    if (!r.ok) {
      this.error = r.message;
      return;
    }
    const login = this.auth.login(this.email.trim(), this.password);
    if (login.ok && login.user) {
      this.router.navigate([login.user.role === 'admin' ? '/admin' : '/dashboard']);
    } else {
      this.success = 'Account created. Please sign in.';
      this.router.navigate(['/login']);
    }
  }
}
