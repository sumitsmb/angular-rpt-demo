import { Component, OnInit } from '@angular/core';
import { AuthService, User, Role } from '../auth.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['../dashboard.shared.css', './manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  current: User | null = null;
  users: User[] = [];
  editingId: number | null = null;
  draft: { name: string; email: string; role: Role; premium: boolean } = {
    name: '',
    email: '',
    role: 'user',
    premium: false,
  };
  message = '';
  messageType: 'success' | 'error' = 'success';
  search = '';

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.current = this.auth.currentUser();
    this.refresh();
  }

  refresh(): void {
    this.users = this.auth.getUsers();
  }

  get filtered(): User[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(
      u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  startEdit(u: User): void {
    this.editingId = u.id;
    this.draft = { name: u.name, email: u.email, role: u.role, premium: u.premium };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.message = '';
  }

  saveEdit(u: User): void {
    const all = this.auth.getUsers();
    const name = this.draft.name.trim();
    const email = this.draft.email.trim();
    if (!name || !email) {
      this.flash('Name and email are required', 'error');
      return;
    }
    const dup = all.find(x => x.id !== u.id && x.email.toLowerCase() === email.toLowerCase());
    if (dup) {
      this.flash('Another account uses that email', 'error');
      return;
    }
    const idx = all.findIndex(x => x.id === u.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], name, email, role: this.draft.role, premium: this.draft.premium };
      localStorage.setItem('app_users', JSON.stringify(all));
      this.editingId = null;
      this.refresh();
      this.flash('User updated', 'success');
    }
  }

  remove(u: User): void {
    if (this.current?.id === u.id) {
      this.flash("You can't delete the account you're signed in with", 'error');
      return;
    }
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    const all = this.auth.getUsers().filter(x => x.id !== u.id);
    localStorage.setItem('app_users', JSON.stringify(all));
    this.refresh();
    this.flash('User deleted', 'success');
  }

  togglePremium(u: User): void {
    const all = this.auth.getUsers();
    const idx = all.findIndex(x => x.id === u.id);
    if (idx >= 0) {
      all[idx].premium = !all[idx].premium;
      localStorage.setItem('app_users', JSON.stringify(all));
      this.refresh();
    }
  }

  private flash(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 2500);
  }
}
