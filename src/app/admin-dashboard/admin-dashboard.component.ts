import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../auth.service';

interface Payment {
  id: number;
  user: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['../dashboard.shared.css'],
})
export class AdminDashboardComponent implements OnInit {
  current: User | null = null;
  users: User[] = [];
  totalUsers = 0;
  premiumUsers = 0;
  freeUsers = 0;
  totalPayments = 0;
  pendingPayments = 0;
  monthRevenue = 0;
  newUsersThisMonth = 0;
  conversionRate = 0;
  payments: Payment[] = [];

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.current = this.auth.currentUser();
    this.users = this.auth.getUsers();
    this.totalUsers = this.users.length;
    this.premiumUsers = this.users.filter(u => u.premium).length;
    this.freeUsers = this.totalUsers - this.premiumUsers;

    this.payments = this.generatePayments();
    this.totalPayments = this.payments
      .filter(p => p.status === 'completed')
      .reduce((s, p) => s + p.amount, 0);
    this.pendingPayments = this.payments
      .filter(p => p.status === 'pending')
      .reduce((s, p) => s + p.amount, 0);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    this.monthRevenue = this.payments
      .filter(p => p.status === 'completed' && new Date(p.date) >= monthStart)
      .reduce((s, p) => s + p.amount, 0);

    this.newUsersThisMonth = this.users.filter(u => new Date(u.createdAt) >= monthStart).length;
    this.conversionRate = this.totalUsers
      ? Math.round((this.premiumUsers / this.totalUsers) * 100)
      : 0;
  }

  private generatePayments(): Payment[] {
    const seed = [
      { user: 'Admin', amount: 199, days: 1 },
      { user: 'Demo User', amount: 49, days: 3 },
      { user: 'Sara K.', amount: 99, days: 5 },
      { user: 'Tom L.', amount: 199, days: 8 },
      { user: 'Mira P.', amount: 29, days: 12 },
      { user: 'Jay R.', amount: 149, days: 18 },
      { user: 'Eli M.', amount: 49, days: 25 },
    ];
    return seed.map((s, i) => {
      const d = new Date();
      d.setDate(d.getDate() - s.days);
      return {
        id: i + 1,
        user: s.user,
        amount: s.amount,
        date: d.toISOString(),
        status: i === 4 ? 'pending' : 'completed',
      };
    });
  }

  togglePremium(u: User): void {
    const all = this.auth.getUsers();
    const idx = all.findIndex(x => x.id === u.id);
    if (idx >= 0) {
      all[idx].premium = !all[idx].premium;
      localStorage.setItem('app_users', JSON.stringify(all));
      this.ngOnInit();
    }
  }
}
