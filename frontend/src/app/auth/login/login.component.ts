import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { API_URL } from '../../config/api-url';
import { CardService } from '../../services/card-service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cardService: CardService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  showEmailValidationError(): String {
    const emailControl = this.loginForm.get('email');
    if (emailControl.touched && !emailControl.valid) {
      if (emailControl.errors['required']) {
        return 'Email address is required.';
      }
      if (emailControl.errors['email']) {
        return 'Enter a valid email address.';
      }
    }
    return '';
  }

  showPasswordValidationError(): String {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl.touched && !passwordControl.valid) {
      if (passwordControl.errors['required']) {
        return 'Password is required.';
      }
    }
    return '';
  }

  onLogin() {

    const userData = this.loginForm.value;

    this.http.post(`${API_URL}/login`, userData, {
      withCredentials: true
    }).subscribe({

      next: () => {
        this.cardService.clearAllCaches();
        this.userService.clearProfileCache();
        this.userService.getProfile(true).subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: () => {
            alert('Session could not be established. Sign in again.');
          },
        });
      },

      error: () => {
        alert('Sign-in failed. Check your email and password.');
      },

    });

  }
}
