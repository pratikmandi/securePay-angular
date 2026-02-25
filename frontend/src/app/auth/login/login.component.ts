import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  showEmailValidationError(): String {
    const emailControl = this.loginForm.get('email');
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
    const passwordControl = this.loginForm.get('password');
    if (passwordControl.touched && !passwordControl.valid) {
      if (passwordControl.errors['required']) {
        return 'Enter valid password';
      }
    }
    return '';
  }

  onLogin() {
    console.log(this.loginForm.value);
  }
}
