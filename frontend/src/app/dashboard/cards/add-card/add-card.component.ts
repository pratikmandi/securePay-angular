import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CardService } from '../../../services/card-service';
import {
  cardNumberValidator,
  expiryValidator,
  normalizeCardNumberDigits,
} from '../../../validators/card.validators';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css'],
})
export class AddCardComponent implements OnInit {
  cardGroup!: FormGroup;
  serverError = '';
  submitting = false;

  @Output() cardAdded = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  constructor(private cardService: CardService) {}

  onOverlayClick(): void {
    this.dismiss.emit();
  }

  ngOnInit(): void {
    this.cardGroup = new FormGroup({
      cardHolderName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
      ]),
      cardNumber: new FormControl('', [
        Validators.required,
        cardNumberValidator(),
      ]),
      expireDate: new FormControl('', [
        Validators.required,
        expiryValidator(),
      ]),
      balance: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
    });
  }

  cardNumberHint(): string {
    const digits = normalizeCardNumberDigits(
      this.cardGroup.get('cardNumber')?.value ?? '',
    );
    if (!digits.length) {
      return '13–19 digits. Non-numeric characters are ignored.';
    }
    return `${digits.length} digits entered.`;
  }

  fieldError(field: string): string {
    const c = this.cardGroup.get(field);
    if (!c || !c.touched || !c.errors) return '';

    if (field === 'cardNumber') {
      if (c.errors['required']) return 'Card number is required.';
      if (c.errors['cardLength'])
        return 'Enter 13–19 digits.';
      if (c.errors['luhn']) return 'Invalid card number.';
    }
    if (field === 'expireDate') {
      if (c.errors['required']) return 'Expiry date is required.';
      if (c.errors['expiryFormat'])
        return 'Use MM/YY format.';
      if (c.errors['expiryMonth']) return 'Invalid month.';
      if (c.errors['expiryPast']) return 'Card has expired.';
    }
    if (field === 'balance') {
      if (c.errors['required']) return 'Opening balance is required.';
      if (c.errors['min']) return 'Amount cannot be negative.';
    }
    if (field === 'cardHolderName') {
      if (c.errors['required']) return 'Cardholder name is required.';
      if (c.errors['minlength']) return 'Name must be at least 2 characters.';
    }
    return '';
  }

  onCardAdd(): void {
    this.serverError = '';
    if (this.cardGroup.invalid) {
      this.cardGroup.markAllAsTouched();
      return;
    }

    const v = this.cardGroup.value;
    const payload = {
      cardHolderName: String(v.cardHolderName).trim(),
      cardNumber: normalizeCardNumberDigits(v.cardNumber),
      expireDate: String(v.expireDate).trim(),
      balance: Number(v.balance),
    };

    this.submitting = true;
    this.cardService.addCard(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.cardGroup.reset();
        this.cardAdded.emit();
      },
      error: (err) => {
        this.submitting = false;
        const msg =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          'Unable to register card.';
        this.serverError = msg;
      },
    });
  }
}
