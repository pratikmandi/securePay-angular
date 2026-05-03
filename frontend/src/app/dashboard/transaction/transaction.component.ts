import { Component, OnInit } from '@angular/core';
import {
  CardService,
  LedgerTransaction,
  PaymentCard,
} from '../../services/card-service';
import { normalizeCardNumberDigits } from '../../validators/card.validators';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
  cards: PaymentCard[] = [];
  transactions: LedgerTransaction[] = [];

  selectedCard = '';
  amount: number | null = null;
  description = '';

  billAmount: number | null = null;
  billPayee = '';
  billNote = '';

  fromCard = '';
  toCard = '';
  internalAmount: number | null = null;
  internalNote = '';

  loading = false;
  errorMsg = '';

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.loading = true;
    this.errorMsg = '';
    this.cardService.getCards().subscribe({
      next: (data) => {
        this.cards = data;
        if (!this.selectedCard && data.length) {
          this.selectedCard = String(data[0].cardNumber);
        }
        if (data.length >= 2) {
          if (!this.fromCard) this.fromCard = String(data[0].cardNumber);
          if (!this.toCard || this.toCard === this.fromCard) {
            this.toCard = String(data[1].cardNumber);
          }
        } else {
          this.fromCard = '';
          this.toCard = '';
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Unable to load cards.';
      },
    });

    this.loadTransactions();
  }

  loadTransactions(): void {
    this.cardService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: () => {
        this.errorMsg = 'Unable to load transactions.';
      },
    });
  }

  lastFour(cardNumber: string): string {
    const s = normalizeCardNumberDigits(cardNumber);
    return s.length >= 4 ? s.slice(-4) : s;
  }

  cardBrand(raw: string): string {
    const d = normalizeCardNumberDigits(raw);
    if (!d.length) return 'Card';
    if (d.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(d)) return 'Mastercard';
    if (/^3[47]/.test(d)) return 'Amex';
    if (/^6(?:011|5)/.test(d)) return 'Discover';
    return 'Card';
  }

  isCreditEntry(t: LedgerTransaction): boolean {
    return t.direction === 'credit' || t.type === 'balance_credit';
  }

  totalDebited(): number {
    return this.transactions
      .filter((t) => !this.isCreditEntry(t))
      .reduce((sum, t) => sum + Number(t.amount ?? 0), 0);
  }

  totalCredited(): number {
    return this.transactions
      .filter((t) => this.isCreditEntry(t))
      .reduce((sum, t) => sum + Number(t.amount ?? 0), 0);
  }

  txTypeLabel(t: LedgerTransaction): string {
    if (t.type === 'bill') return 'Bill';
    if (t.type === 'balance_credit') return 'Credit';
    if (t.type === 'card_transfer') {
      return this.isCreditEntry(t) ? 'Transfer in' : 'Transfer out';
    }
    return 'Transfer';
  }

  transferFromPan(t: LedgerTransaction): string {
    if (t.type !== 'card_transfer' || !t.toCardNumber) return t.cardNumber;
    return this.isCreditEntry(t) ? t.toCardNumber : t.cardNumber;
  }

  transferToPan(t: LedgerTransaction): string {
    if (t.type !== 'card_transfer' || !t.toCardNumber) return t.cardNumber;
    return this.isCreditEntry(t) ? t.cardNumber : t.toCardNumber;
  }

  transferBetweenCards(): void {
    this.errorMsg = '';
    if (this.cards.length < 2) {
      this.errorMsg = 'At least two cards are required.';
      return;
    }
    if (!this.fromCard || !this.toCard) {
      this.errorMsg = 'Select both cards.';
      return;
    }
    if (this.fromCard === this.toCard) {
      this.errorMsg = 'Select two different cards.';
      return;
    }
    const amt = Number(this.internalAmount);
    if (!amt || amt <= 0) {
      this.errorMsg = 'Enter a valid amount.';
      return;
    }

    this.cardService
      .transferBetweenCards({
        fromCardNumber: this.fromCard,
        toCardNumber: this.toCard,
        amount: amt,
        description: this.internalNote.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.internalAmount = null;
          this.internalNote = '';
          this.loadTransactions();
          this.refreshCardsOnly();
        },
        error: (err) => {
          this.errorMsg =
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : '') ||
            'Transfer could not be completed.';
        },
      });
  }

  makeTransfer(): void {
    this.errorMsg = '';
    if (!this.selectedCard) {
      this.errorMsg = 'Select a debit card.';
      return;
    }
    const amt = Number(this.amount);
    if (!amt || amt <= 0) {
      this.errorMsg = 'Enter a valid amount.';
      return;
    }

    this.cardService
      .makeTransaction({
        cardNumber: this.selectedCard,
        amount: amt,
        description: this.description || 'Outbound payment',
        type: 'transfer',
      })
      .subscribe({
        next: () => {
          this.amount = null;
          this.description = '';
          this.loadTransactions();
          this.refreshCardsOnly();
        },
        error: (err) => {
          this.errorMsg =
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : '') ||
            'Payment could not be processed.';
        },
      });
  }

  payBill(): void {
    this.errorMsg = '';
    if (!this.selectedCard) {
      this.errorMsg = 'Select a debit card.';
      return;
    }
    const amt = Number(this.billAmount);
    if (!amt || amt <= 0) {
      this.errorMsg = 'Enter a valid amount.';
      return;
    }
    const payee = this.billPayee.trim();
    if (!payee) {
      this.errorMsg = 'Enter the payee name.';
      return;
    }

    this.cardService
      .makeTransaction({
        cardNumber: this.selectedCard,
        amount: amt,
        description: this.billNote.trim() || 'Bill paid',
        type: 'bill',
        payee,
      })
      .subscribe({
        next: () => {
          this.billAmount = null;
          this.billPayee = '';
          this.billNote = '';
          this.loadTransactions();
          this.refreshCardsOnly();
        },
        error: (err) => {
          this.errorMsg =
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : '') ||
            'Bill payment could not be processed.';
        },
      });
  }

  private refreshCardsOnly(): void {
    this.cardService.getCards().subscribe({
      next: (data) => {
        this.cards = data;
      },
    });
  }
}
