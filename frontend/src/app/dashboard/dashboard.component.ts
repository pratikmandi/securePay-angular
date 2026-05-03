import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardService } from '../services/card-service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(
    private router: Router,
    private userService: UserService,
    private cardService: CardService,
  ) {}

  logout(): void {
    this.cardService.clearAllCaches();
    this.userService.clearProfileCache();
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Sign-out failed. Check your connection and try again.');
      },
    });
  }
}
