import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { FamilyMemberService } from '../../../core/services/family-member';

@Component({
  selector: 'app-family-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './family-list.html',
  styleUrl: './family-list.css',
})
export class FamilyList implements OnInit {

  familyAccountNumber = '';

  familyMembers: any[] = [];

  selectedMember: any = null;

  loading = false;

  errorMessage = '';

  constructor(
    private familyMemberService: FamilyMemberService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // IMPORTANT:
    // Get the account number from the current browser tab.
    this.familyAccountNumber =
      sessionStorage.getItem('familyAccountNumber') || '';

    console.log(
      'Logged-in family account:',
      this.familyAccountNumber
    );

    if (!this.familyAccountNumber) {

      this.errorMessage =
        'Family account number not found. Please login again.';

      return;
    }

    this.loadFamilyMembers();
  }

  loadFamilyMembers(): void {

    this.loading = true;

    this.errorMessage = '';

    console.log(
      'Loading family members for account:',
      this.familyAccountNumber
    );

    this.familyMemberService
      .getFamilyMembers(this.familyAccountNumber)
      .subscribe({

        next: (members: any[]) => {

          console.log(
            'Family members response:',
            members
          );

          this.familyMembers = members;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error: any) => {

          console.error(
            'Failed to load family members:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Failed to load family members.';

          this.loading = false;

          this.cdr.detectChanges();
        },

        complete: () => {

          console.log(
            'Family members request completed'
          );

        }

      });
  }

  viewMember(member: any): void {

    this.selectedMember = member;

    this.cdr.detectChanges();
  }

  closeMember(): void {

    this.selectedMember = null;

    this.cdr.detectChanges();
  }

}