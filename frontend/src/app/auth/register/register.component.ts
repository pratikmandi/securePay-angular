import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { API_URL } from '../../config/api-url';
import { CardService } from '../../services/card-service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cardService: CardService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  showNameValidationError(): String {
    const nameControl = this.registerForm.get('name');
    if (nameControl.touched && !nameControl.valid) {
      if (nameControl.errors['required']) {
        return 'Full name is required.';
      }

      if (nameControl.errors['minlength']) {
        return 'Use at least 2 characters.';
      }

      if (nameControl.errors['maxlength']) {
        return 'Maximum length is 20 characters.';
      }
    }
    return '';
  }

  showUsernameValidationError(): String {
    const usernameControl = this.registerForm.get('username');
    if (usernameControl.touched && !usernameControl.valid) {
      if (usernameControl.errors['required']) {
        return 'Username is required.';
      }

      if (usernameControl.errors['minlength']) {
        return 'Use at least 3 characters.';
      }

      if (usernameControl.errors['maxlength']) {
        return 'Maximum length is 15 characters.';
      }
    }
    return '';
  }

  showEmailValidationError(): String {
    const emailControl = this.registerForm.get('email');
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
    const passwordControl = this.registerForm.get('password');
    if (passwordControl.touched && !passwordControl.valid) {
      if (passwordControl.errors['required']) {
        return 'Password is required.';
      }
    }
    return '';
  }

  onRegister() {
    let user = this.registerForm.getRawValue();
    this.http
      .post(`${API_URL}/register`, user, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.cardService.clearAllCaches();
          this.userService.clearProfileCache();
          this.userService.getProfile(true).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: () => this.router.navigate(['/dashboard']),
          });
        },
        error: () => {
          alert('Registration failed. This email may already be in use.');
        },
      });
  }
}
