import { Component, OnInit } from '@angular/core';
import { CardService } from '../../services/card-service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
})
export class CardsComponent implements OnInit {

  cards: any[] = [];

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
