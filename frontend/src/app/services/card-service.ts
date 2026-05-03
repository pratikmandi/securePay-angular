import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private http: HttpClient) {}

  addCard(data:any){
    return this.http.post(
      'http://localhost:5050/auth/cards',
      data,
      {withCredentials:true}
    );
  }

  getCards() {
    return this.http.get('http://localhost:5050/auth/cards', {
      withCredentials: true
    });
  }
}
