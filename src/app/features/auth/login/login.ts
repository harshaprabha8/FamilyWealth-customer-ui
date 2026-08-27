import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  loginForm: FormGroup;

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth
  ) {

    this.loginForm = this.fb.group({

      familyAccountNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]{11}$')
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,20}$'
          )
        ]
      ]

    });

  }

  ngOnInit(): void {

    const message =
      sessionStorage.getItem('registerSuccess');

    if (message) {

      this.successMessage = message;

      sessionStorage.removeItem(
        'registerSuccess'
      );

    }

  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      return;
    }

    this.auth.login(
      this.loginForm.value
    ).subscribe({

      next: (response: any) => {

        // Store login information only
        // for the current browser tab.
        sessionStorage.setItem(
          'token',
          response.token
        );

        // Store the logged-in family's
        // account number for this tab.
        sessionStorage.setItem(
          'familyAccountNumber',
          response.familyAccountNumber
        );

        // Store the logged-in user's name
        // for this tab.
        sessionStorage.setItem(
          'userName',
          response.fullName
        );

        this.successMessage =
          '✅ Login Successful!';

        this.errorMessage = '';

        setTimeout(() => {

          this.router.navigate([
            '/dashboard'
          ]);

        }, 2000);

      },

      error: (error: any) => {

        this.successMessage = '';

        this.errorMessage =
          error.error?.message ||
          'Invalid Family Account Number or Password';

      }

    });

  }

}