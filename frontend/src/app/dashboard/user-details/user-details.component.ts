import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  loading = true;
  saving = false;
  errorMsg = '';
  successMsg = '';

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    address: [''],
    profession: [''],
    organization: [''],
  });

  emailDisplay = '';
  usernameDisplay = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.emailDisplay = user.email;
        this.usernameDisplay = user.username;
        this.profileForm.patchValue({
          name: user.name,
          address: user.address ?? '',
          profession: user.profession ?? '',
          organization: user.organization ?? '',
        });
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Unable to load profile.';
        this.loading = false;
      },
    });
  }

  save(): void {
    this.errorMsg = '';
    this.successMsg = '';
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const v = this.profileForm.getRawValue();
    this.saving = true;
    this.userService
      .updateProfile({
        name: v.name ?? '',
        address: v.address ?? '',
        profession: v.profession ?? '',
        organization: v.organization ?? '',
      })
      .subscribe({
        next: (updated) => {
          this.saving = false;
          this.successMsg = 'Changes saved.';
          this.profileForm.patchValue({
            name: updated.name,
            address: updated.address ?? '',
            profession: updated.profession ?? '',
            organization: updated.organization ?? '',
          });
        },
        error: (err) => {
          this.saving = false;
          this.errorMsg =
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : '') ||
            'Unable to save changes.';
        },
      });
  }
}
