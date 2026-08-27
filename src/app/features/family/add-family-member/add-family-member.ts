import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { FamilyMemberService } from '../../../core/services/family-member';

@Component({
  selector: 'app-add-family-member',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-family-member.html',
  styleUrl: './add-family-member.css'
})
export class AddFamilyMember {

  memberForm: FormGroup;

  successMessage = '';
  errorMessage = '';

  // Success popup
  showSuccessPopup = false;
  createdAccountNumber = '';
  createdPassword = '';

  // Logged-in family's account number
  familyAccountNumber = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private familyMemberService: FamilyMemberService
  ) {

    // IMPORTANT:
    // Use sessionStorage so each browser tab
    // keeps its own logged-in family account.
    this.familyAccountNumber =
      sessionStorage.getItem('familyAccountNumber') || '';

    this.memberForm = this.fb.group({

      // Personal Details

      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]+$')
        ]
      ],

      relationship: [
        '',
        Validators.required
      ],

      dateOfBirth: [
        '',
        Validators.required
      ],

      gender: [
        '',
        Validators.required
      ],

      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[6-9][0-9]{9}$')
        ]
      ],

      email: [
        '',
        [
          Validators.email,
          Validators.maxLength(100)
        ]
      ],

      occupation: [
        '',
        Validators.maxLength(100)
      ],

      // Identity Verification

      aadhaarNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{12}$')
        ]
      ],

      panNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
          )
        ]
      ],

      // Photograph is OPTIONAL

      photo: [
        ''
      ],

      // Login Details

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

    });

  }

  onSubmit(): void {

    this.successMessage = '';
    this.errorMessage = '';

    // Make sure the logged-in family's account number exists.
    if (!this.familyAccountNumber) {

      this.errorMessage =
        'Family account number not found. Please login again.';

      return;
    }

    // Validate form.
    if (this.memberForm.invalid) {

      this.memberForm.markAllAsTouched();

      return;
    }

    const password =
      this.memberForm.get('password')?.value;

    const confirmPassword =
      this.memberForm.get('confirmPassword')?.value;

    // Check password confirmation.
    if (password !== confirmPassword) {

      this.errorMessage =
        'Password and Confirm Password do not match.';

      return;
    }

    const memberData = {
      ...this.memberForm.value
    };

    // Add member to the currently logged-in family's account.
    this.familyMemberService
      .addFamilyMember(
        this.familyAccountNumber,
        memberData
      )
      .subscribe({

        next: (response: any) => {

          // Show the currently logged-in family's
          // account number in the success popup.
          this.createdAccountNumber =
            this.familyAccountNumber;

          // Show password created for this member.
          this.createdPassword =
            password;

          this.showSuccessPopup = true;

          this.successMessage = '';
          this.errorMessage = '';

          this.memberForm.reset();

        },

        error: (error: any) => {

          this.errorMessage =
            error.error?.message ||
            'Failed to add family member.';

        }

      });

  }

  allowOnlyNumbers(event: KeyboardEvent): void {

    const charCode = event.which
      ? event.which
      : event.keyCode;

    if (charCode < 48 || charCode > 57) {

      event.preventDefault();

    }

  }

  onPhotoSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.memberForm.patchValue({
        photo: input.files[0].name
      });

    }

  }

  closeSuccessPopup(): void {

    this.showSuccessPopup = false;

    this.createdAccountNumber = '';
    this.createdPassword = '';

    this.router.navigate([
      '/dashboard/family'
    ]);

  }

  cancel(): void {

    this.router.navigate([
      '/dashboard/family'
    ]);

  }

}