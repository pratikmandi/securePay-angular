import { Component, Input, OnInit } from '@angular/core';
import { CardService } from '../../../services/card-service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css',
})
export class CardDetailComponent {
  @Input() cardHolder: String;
  @Input() cardNumber: String;
  @Input() exipreDate: String;
  @Input() balance: String;
  @Input() cardType: String;

  constructor(private cardService: CardService) {}

  cardData: any[] = [];
}
