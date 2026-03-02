import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css',
})
export class AddCardComponent {
  cardGroup: FormGroup;

  onCardAdd() {}

  hideForm() {}
}
