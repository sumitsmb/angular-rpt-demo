import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.shared.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }
    this.loading = true;
    const result = this.auth.login(this.email.trim(), this.password);
    this.loading = false;
    if (!result.ok || !result.user) {
      this.error = result.message;
      return;
    }
    this.router.navigate([result.user.role === 'admin' ? '/admin' : '/dashboard']);
  }
}
