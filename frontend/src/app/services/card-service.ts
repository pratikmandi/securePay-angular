import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../config/api-url';

export interface PaymentCard {
  _id: string;
  cardHolderName: string;
  cardNumber: string;
  expireDate: string;
  balance: number;
}

export interface LedgerTransaction {
  _id: string;
  cardNumber: string;
  toCardNumber?: string;
  amount: number;
  description: string;
  type: 'transfer' | 'bill' | 'card_transfer' | 'balance_credit';
  /** debit | credit; omitted on legacy rows = debit */
  direction?: 'debit' | 'credit';
  payee?: string;
  date: string;
}

export interface TransactionPayload {
  cardNumber: string;
  amount: number;
  description?: string;
  type?: 'transfer' | 'bill';
  payee?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private readonly base = API_URL;

  /** Cached lists for dashboard navigation (invalidated on mutations / logout). */
  private cardsCache: PaymentCard[] | null = null;
  private transactionsCache: LedgerTransaction[] | null = null;

  constructor(private http: HttpClient) {}

  clearAllCaches(): void {
    this.cardsCache = null;
    this.transactionsCache = null;
  }

  addCard(data: Record<string, unknown>) {
    return this.http
      .post<PaymentCard>(`${this.base}/cards`, data, {
        withCredentials: true,
      })
      .pipe(tap(() => (this.cardsCache = null)));
  }

  /**
   * Cards list for the signed-in user.
   * Reuses an in-memory cache unless `force` is true (e.g. pull-to-refresh if you add it later).
   */
  getCards(force = false): Observable<PaymentCard[]> {
    if (!force && this.cardsCache !== null) {
      return of(this.cardsCache.slice());
    }
    return this.http
      .get<PaymentCard[]>(`${this.base}/cards`, {
        withCredentials: true,
      })
      .pipe(tap((cards) => (this.cardsCache = cards.slice())));
  }

  /** Adds `amount` to the card's current balance (does not replace it). */
  addToCardBalance(cardId: string, amount: number) {
    return this.http
      .patch<{ message: string; balance: number }>(
        `${this.base}/cards/${cardId}/balance`,
        { amount },
        { withCredentials: true },
      )
      .pipe(
        tap(() => {
          this.cardsCache = null;
          this.transactionsCache = null;
        }),
      );
  }

  getTransactions(force = false): Observable<LedgerTransaction[]> {
    if (!force && this.transactionsCache !== null) {
      return of(this.transactionsCache.slice());
    }
    return this.http
      .get<LedgerTransaction[]>(`${this.base}/transactions`, {
        withCredentials: true,
      })
      .pipe(tap((rows) => (this.transactionsCache = rows.slice())));
  }

  makeTransaction(body: TransactionPayload) {
    return this.http
      .post<{ message: string; balance: number }>(
        `${this.base}/transaction`,
        body,
        { withCredentials: true },
      )
      .pipe(
        tap(() => {
          this.cardsCache = null;
          this.transactionsCache = null;
        }),
      );
  }

  transferBetweenCards(body: {
    fromCardNumber: string;
    toCardNumber: string;
    amount: number;
    description?: string;
  }) {
    return this.http
      .post<{
        message: string;
        fromBalance: number;
        toBalance: number;
      }>(`${this.base}/transfer-between-cards`, body, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.cardsCache = null;
          this.transactionsCache = null;
        }),
      );
  }
}
