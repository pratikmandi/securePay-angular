import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CardService } from '../../../services/card-service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html'
})
export class AddCardComponent implements OnInit {

  cardGroup!: FormGroup;
@Output() cardAdded = new EventEmitter();
  constructor(private cardService: CardService) {}

  ngOnInit() {

    this.cardGroup = new FormGroup({
      cardHolderName: new FormControl('', Validators.required),
      cardNumber: new FormControl('', Validators.required),
      expireDate: new FormControl('', Validators.required),
      balance: new FormControl('', Validators.required)
    });

  }

  onCardAdd() {

  const cardData = this.cardGroup.value;

  this.cardService.addCard(cardData).subscribe({
    next: (res) => {
      console.log("Card added:", res);
      alert("Card added successfully");

      this.cardGroup.reset();

      // notify parent component
      this.cardAdded.emit();
    },
    error: (err) => {
      console.error("Error adding card", err);
    }
  });

}

}
