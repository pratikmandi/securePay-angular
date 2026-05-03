import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CardService,
  PaymentCard,
} from '../../../services/card-service';
import { normalizeCardNumberDigits } from '../../../validators/card.validators';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css',
})
export class CardDetailComponent {
  @Input({ required: true }) card!: PaymentCard;
  @Output() cardUpdated = new EventEmitter<void>();

  addAmount: number | null = null;
  saving = false;
  feedback = '';

  constructor(private cardService: CardService) {}

  maskPan(raw: string): string {
    const d = normalizeCardNumberDigits(raw);
    if (d.length < 4) return '••••';
    return `•••• •••• •••• ${d.slice(-4)}`;
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

  applyAddFunds(): void {
    this.feedback = '';
    if (this.addAmount === null || this.addAmount === undefined) {
      this.feedback = 'Enter an amount.';
      return;
    }
    if (this.addAmount <= 0) {
      this.feedback = 'Amount must be greater than zero.';
      return;
    }

    this.saving = true;
    this.cardService.addToCardBalance(this.card._id, this.addAmount).subscribe({
      next: (res) => {
        this.saving = false;
        this.card.balance = res.balance;
        this.addAmount = null;
        this.feedback = 'Balance updated.';
        this.cardUpdated.emit();
      },
      error: (err) => {
        this.saving = false;
        this.feedback =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : '') ||
          'Request failed.';
      },
    });
  }
}
