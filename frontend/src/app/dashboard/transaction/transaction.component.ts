import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {

  cards: any[] = [];
  transactions: any[] = [];

  selectedCard: string = '';
  amount: number = 0;
  description: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    // fetch cards
    this.http.get('http://localhost:5050/auth/cards', {
      withCredentials: true
    }).subscribe((data: any) => {
      this.cards = data;
    });

    // fetch transaction history
    this.loadTransactions();

  }

  loadTransactions() {

    this.http.get('http://localhost:5050/auth/transactions', {
      withCredentials: true
    }).subscribe((data: any) => {
      this.transactions = data;
    });

  }

  makeTransaction() {

    const transactionData = {
      cardNumber: this.selectedCard,
      amount: this.amount,
      description: this.description
    };

    this.http.post(
      'http://localhost:5050/auth/transaction',
      transactionData,
      { withCredentials: true }
    ).subscribe({

      next: (res) => {

        console.log("Transaction successful", res);

        alert("Transaction completed");

        // reload transactions
        this.loadTransactions();

        // reset form
        this.amount = 0;
        this.description = '';

      },

      error: (err) => {
        console.error("Transaction failed", err);
      }

    });

  }

}
