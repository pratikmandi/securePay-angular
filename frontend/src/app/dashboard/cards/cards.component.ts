import { Component, OnInit } from '@angular/core';
import { CardService, PaymentCard } from '../../services/card-service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {

  cards: PaymentCard[] = [];

  showForm: boolean = false

  constructor(private cardService: CardService) {}

  ngOnInit() {

    this.loadCards();

  }

  loadCards() {

  this.cardService.getCards().subscribe({
    next: (data:any) => {
      this.cards = data;
    },
    error: (err) => {
      console.error(err);
    }
  });

}

}
