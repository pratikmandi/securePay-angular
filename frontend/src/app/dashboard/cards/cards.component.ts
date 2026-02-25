import { Component } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent {
  cards = [
    {
      name: 'Pratik',
      cardNumber: '1234 5678 9000 0000',
      cardType: 'Visa',
      expireDate: '09/26',
      balance: '100000',
    },
    {
      name: 'Aditya',
      cardNumber: '4321 8765 0009 0000',
      cardType: 'Mastercard',
      expireDate: '01/30',
      balance: '0.45',
    },
    {
      name: 'Shahbaz',
      cardNumber: '9873 8373 2302 0000',
      cardType: 'RuPay',
      expireDate: '07/27',
      balance: '7000',
    },
  ];
}
