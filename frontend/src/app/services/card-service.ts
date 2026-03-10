import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private http: HttpClient) {}

  getCard() {
    return this.http.get(`mongodb://127.0.0.1:27017/cards`);
  }
}
