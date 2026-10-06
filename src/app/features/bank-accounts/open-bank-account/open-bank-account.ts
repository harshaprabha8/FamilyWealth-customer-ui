import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  BankAccountService
} from '../../../core/services/bank-account';


@Component({
  selector: 'app-open-bank-account',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './open-bank-account.html',

  styleUrl: './open-bank-account.css'
})
export class OpenBankAccount implements OnInit {


  // =====================================================
  // FAMILY INFORMATION
  // =====================================================

  familyAccountNumber = '';

  familyName = '';


  // =====================================================
  // ACCOUNT DETAILS
  // =====================================================

  accountType = 'FAMILY_SAVINGS';

  branch = '';

  initialDeposit: number | null = null;


  // =====================================================
  // NOMINEE DETAILS
  // =====================================================

  nomineeName = '';

  nomineeRelationship = '';

  nomineeDateOfBirth = '';

  nomineePhoneNumber = '';


  // =====================================================
  // BANKING SERVICES
  // =====================================================

  debitCard = true;

  internetBanking = true;

  mobileBanking = true;


  // =====================================================
  // UI STATE
  // =====================================================

  successMessage = '';

  errorMessage = '';

  submitting = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private router: Router,

    private bankAccountService:
      BankAccountService

  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.familyAccountNumber =
      sessionStorage.getItem(
        'familyAccountNumber'
      ) || '';


    console.log(
      'Family Account Number:',
      this.familyAccountNumber
    );


    if (!this.familyAccountNumber) {

      this.errorMessage =
        'Family account number not found. Please login again.';

    }

  }


  // =====================================================
  // SUBMIT BANK ACCOUNT APPLICATION
  // =====================================================

  submitApplication(): void {


    // ---------------------------------------------------
    // Clear previous messages
    // ---------------------------------------------------

    this.successMessage = '';

    this.errorMessage = '';


    // ---------------------------------------------------
    // Check Family Account Number
    // ---------------------------------------------------

    if (!this.familyAccountNumber) {

      this.errorMessage =
        'Family account number not found. Please login again.';

      return;

    }


    // ---------------------------------------------------
    // Validate Family Name
    // ---------------------------------------------------

    if (
      !this.familyName ||
      !this.familyName.trim()
    ) {

      this.errorMessage =
        'Family Name is required.';

      return;

    }


    // ---------------------------------------------------
    // Validate Branch
    // ---------------------------------------------------

    if (!this.branch) {

      this.errorMessage =
        'Please select a branch.';

      return;

    }


    // ---------------------------------------------------
    // Validate Initial Deposit
    // ---------------------------------------------------

    if (
      this.initialDeposit === null ||
      this.initialDeposit < 0
    ) {

      this.errorMessage =
        'Please enter a valid initial deposit.';

      return;

    }


    // ---------------------------------------------------
    // Validate Nominee Name
    // ---------------------------------------------------

    if (
      !this.nomineeName ||
      !this.nomineeName.trim()
    ) {

      this.errorMessage =
        'Nominee Name is required.';

      return;

    }


    // ---------------------------------------------------
    // Validate Nominee Relationship
    // ---------------------------------------------------

    if (!this.nomineeRelationship) {

      this.errorMessage =
        'Nominee Relationship is required.';

      return;

    }


    // ---------------------------------------------------
    // Validate Nominee DOB
    // ---------------------------------------------------

    if (!this.nomineeDateOfBirth) {

      this.errorMessage =
        'Nominee Date of Birth is required.';

      return;

    }


    // ---------------------------------------------------
    // Validate Nominee Phone
    // ---------------------------------------------------

    if (
      !this.nomineePhoneNumber ||
      this.nomineePhoneNumber.length !== 10
    ) {

      this.errorMessage =
        'Please enter a valid 10 digit nominee phone number.';

      return;

    }


    // ===================================================
    // REQUEST OBJECT
    // ===================================================

    const accountData = {

      accountName:
        this.familyName,

      accountType:
        this.accountType,

      branch:
        this.branch,

      initialDeposit:
        this.initialDeposit,

      nomineeName:
        this.nomineeName,

      nomineeRelationship:
        this.nomineeRelationship,

      nomineeDateOfBirth:
        this.nomineeDateOfBirth,

      nomineePhoneNumber:
        this.nomineePhoneNumber,

      debitCard:
        this.debitCard,

      internetBanking:
        this.internetBanking,

      mobileBanking:
        this.mobileBanking

    };


    console.log(
      'Bank Account Request:',
      accountData
    );


    console.log(
      'Bank Account API URL:',
      `http://localhost:8080/api/bank-accounts/${this.familyAccountNumber}`
    );


    // ===================================================
    // START SUBMISSION
    // ===================================================

    this.submitting = true;


    // ===================================================
    // CALL SPRING BOOT API
    // ===================================================

    this.bankAccountService

      .openBankAccount(

        this.familyAccountNumber,

        accountData

      )

      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response: any) => {

          console.log(
            'Bank Account API Response:',
            response
          );


          this.submitting = false;


          this.errorMessage = '';


          this.successMessage =
            response?.message ||
            'Bank Account Application Submitted Successfully.';


          // Clear form after successful submission

          this.familyName = '';

          this.branch = '';

          this.initialDeposit = null;

          this.nomineeName = '';

          this.nomineeRelationship = '';

          this.nomineeDateOfBirth = '';

          this.nomineePhoneNumber = '';

          this.debitCard = true;

          this.internetBanking = true;

          this.mobileBanking = true;

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error: any) => {

          console.error(
            'Bank Account API Error:',
            error
          );


          this.submitting = false;


          this.successMessage = '';


          this.errorMessage =
            error?.error?.message ||
            'Failed to submit bank account application.';

        }

      });

  }


  // =====================================================
  // CANCEL
  // =====================================================

  cancel(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }


  // =====================================================
  // NUMBER VALIDATION
  // =====================================================

  allowOnlyNumbers(
    event: KeyboardEvent
  ): void {

    const charCode =
      event.which
        ? event.which
        : event.keyCode;


    if (
      charCode < 48 ||
      charCode > 57
    ) {

      event.preventDefault();

    }

  }

}