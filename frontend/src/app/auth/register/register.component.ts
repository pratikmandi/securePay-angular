import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
        return 'Name is required!';
      }

      if (nameControl.errors['minlength']) {
        return 'Name must be atleast 2 characters.';
      }

      if (nameControl.errors['maxlength']) {
        return 'Maximum 20 characters allowed.';
      }
    }
    return '';
  }

  showUsernameValidationError(): String {
    const usernameControl = this.registerForm.get('username');
    if (usernameControl.touched && !usernameControl.valid) {
      if (usernameControl.errors['required']) {
        return 'Username is required!';
      }

      if (usernameControl.errors['minlength']) {
        return 'Username must be atleast 3 characters.';
      }

      if (usernameControl.errors['maxlength']) {
        return 'Maximum 15 characters allowed.';
      }
    }
    return '';
  }

  showEmailValidationError(): String {
    const emailControl = this.registerForm.get('email');
    if (emailControl.touched && !emailControl.valid) {
      if (emailControl.errors['required']) {
        return 'Email is required.';
      }
      if (emailControl.errors['email']) {
        return 'Invalid email.';
      }
    }
    return '';
  }

  showPasswordValidationError(): String {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl.touched && !passwordControl.valid) {
      if (passwordControl.errors['required']) {
        return 'Enter valid password';
      }
    }
    return '';
  }

  onRegister() {
    let user = this.registerForm.getRawValue();
    this.http
      .post('http://localhost:5050/auth/register', user, {
        withCredentials: true,
      })
      .subscribe(
        () => this.router.navigate(['/dashboard']),
        (err) => {
          return 'Failed';
        },
      );
  }
}
