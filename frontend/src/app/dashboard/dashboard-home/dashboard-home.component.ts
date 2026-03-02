import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent implements OnInit {
  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get('http://localhost:5050/auth/user', {
        withCredentials: true,
      })
      .subscribe(
        (res: any) => {
          this.message = `Welcome ${res.name}`;
        },
        (err) => {
          this.message = 'You are not logged in!';
        },
      );
  }
}
