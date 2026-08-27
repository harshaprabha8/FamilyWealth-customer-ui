import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth
  ) {

    this.registerForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z ]+$')
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(100)
          ]
        ],

        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern('^[6-9][0-9]{9}$')
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
        ],

        confirmPassword: [
          '',
          Validators.required
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  allowOnlyNumbers(event: KeyboardEvent) {

    const charCode = event.which
      ? event.which
      : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  passwordMatchValidator(control: AbstractControl) {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  successMessage = '';
  errorMessage = '';
  familyAccountNumber = '';

  onSubmit() {

    if (this.registerForm.invalid) {
      return;
    }

    this.auth.register(
      this.registerForm.value
    ).subscribe({

      next: (response: any) => {

  const accountNumber =
    response.familyAccountNumber;

  alert(
    '✅ Registration Successful!\n\n' +
    'Your Family Account Number is:\n' +
    accountNumber +
    '\n\n' +
    'Please save this number. You will use this number ' +
    'with your password to login.'
  );

  this.router.navigate(['/login']);

},

      error: (error: any) => {

        this.successMessage = '';

        this.errorMessage =
          error.error?.message ||
          'Registration Failed';

      }

    });

  }

}