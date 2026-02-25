import { Component, Input } from '@angular/core';

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
}
