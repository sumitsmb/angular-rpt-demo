import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../auth.service';

interface Sale {
  id: number;
  customer: string;
  product: string;
  amount: number;
  date: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['../dashboard.shared.css'],
})
export class UserDashboardComponent implements OnInit {
  current: User | null = null;
  totalSales = 0;
  totalCustomers = 0;
  premiumCustomers = 0;
  totalPayments = 0;
  pendingPayments = 0;
  monthRevenue = 0;
  avgOrderValue = 0;
  topProduct = '';
  sales: Sale[] = [];

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.current = this.auth.currentUser();
    this.sales = this.generateSales();
    this.totalSales = this.sales.length;

    const customers = new Set(this.sales.map(s => s.customer));
    this.totalCustomers = customers.size;
    this.premiumCustomers = Math.round(this.totalCustomers * 0.4);

    this.totalPayments = this.sales.reduce((s, x) => s + x.amount, 0);
    this.pendingPayments = Math.round(this.totalPayments * 0.18);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    this.monthRevenue = this.sales
      .filter(s => new Date(s.date) >= monthStart)
      .reduce((s, x) => s + x.amount, 0);

    this.avgOrderValue = this.totalSales
      ? Math.round(this.totalPayments / this.totalSales)
      : 0;

    const counts: Record<string, number> = {};
    this.sales.forEach(s => (counts[s.product] = (counts[s.product] || 0) + 1));
    this.topProduct = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  }

  private generateSales(): Sale[] {
    const customers = ['Sara K.', 'Tom L.', 'Mira P.', 'Jay R.', 'Eli M.', 'Nina O.', 'Ben S.'];
    const products = ['Starter Plan', 'Pro Plan', 'Add-on Pack', 'Enterprise Plan'];
    const sales: Sale[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i * 2);
      sales.push({
        id: i + 1,
        customer: customers[i % customers.length],
        product: products[i % products.length],
        amount: [29, 79, 49, 199][i % 4],
        date: d.toISOString(),
      });
    }
    return sales;
  }
}
