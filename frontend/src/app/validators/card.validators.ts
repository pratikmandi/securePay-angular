import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function normalizeCardNumberDigits(value: unknown): string {
  return String(value ?? '').replace(/\D/g, '');
}

export function luhnCheck(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (Number.isNaN(n)) return false;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** 13–19 digits + Luhn (aligned with backend). */
export function cardNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const digits = normalizeCardNumberDigits(control.value);
    if (digits.length === 0) return null;
    if (digits.length < 13 || digits.length > 19) {
      return { cardLength: true };
    }
    if (!luhnCheck(digits)) {
      return { luhn: true };
    }
    return null;
  };
}

/** MM/YY or MM/YYYY; must not be in the past (end of expiry month). */
export function expiryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (!raw) return null;

    const m = raw.match(/^(\d{2})\s*\/\s*(\d{2}|\d{4})$/);
    if (!m) {
      return { expiryFormat: true };
    }
    const month = parseInt(m[1], 10);
    let year = parseInt(m[2], 10);
    if (month < 1 || month > 12) {
      return { expiryMonth: true };
    }
    if (m[2].length === 2) {
      year += 2000;
    }
    const expEnd = new Date(year, month, 0, 23, 59, 59, 999);
    if (Date.now() > expEnd.getTime()) {
      return { expiryPast: true };
    }
    return null;
  };
}
