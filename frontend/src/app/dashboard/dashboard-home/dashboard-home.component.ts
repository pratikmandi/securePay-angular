import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  CardService,
  LedgerTransaction,
  PaymentCard,
} from '../../services/card-service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent implements OnInit {
  userName = '';
  welcomeError = '';

  cards: PaymentCard[] = [];
  recentTransactions: LedgerTransaction[] = [];
  totalBalance = 0;
  transactionCount = 0;
  billsThisMonth = 0;

  loading = true;

  constructor(
    private userService: UserService,
    private cardService: CardService,
  ) {}

  ngOnInit(): void {
    forkJoin({
      user: this.userService.getProfile(),
      cards: this.cardService.getCards(),
      transactions: this.cardService.getTransactions(),
    }).subscribe({
      next: ({ user, cards, transactions }) => {
        this.userName = user.name;
        this.cards = cards;
        this.recentTransactions = transactions.slice(0, 6);
        this.transactionCount = transactions.length;
        this.totalBalance = cards.reduce(
          (sum, c) => sum + Number(c.balance ?? 0),
          0,
        );
        this.billsThisMonth = this.countRecentBills(transactions);
        this.loading = false;
      },
      error: () => {
        this.welcomeError = 'Unable to load account summary.';
        this.loading = false;
      },
    });
  }

  lastFour(cardNumber: string): string {
    const s = String(cardNumber || '').replace(/\D/g, '');
    return s.length >= 4 ? s.slice(-4) : s;
  }

  isCreditEntry(t: LedgerTransaction): boolean {
    return t.direction === 'credit' || t.type === 'balance_credit';
  }

  activityLabel(t: LedgerTransaction): string {
    if (t.type === 'bill') return 'Bill';
    if (t.type === 'balance_credit') return 'Credit';
    if (t.type === 'card_transfer') {
      return this.isCreditEntry(t) ? 'Transfer in' : 'Transfer out';
    }
    return 'Transfer';
  }

  private countRecentBills(transactions: LedgerTransaction[]): number {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return transactions.filter(
      (t) =>
        t.type === 'bill' &&
        t.date &&
        new Date(t.date).getTime() >= start.getTime(),
    ).length;
  }
}
