import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FamilyMemberService } from '../../../core/services/family-member';

@Component({
  selector: 'app-family-list',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],

  templateUrl: './family-list.html',
  styleUrl: './family-list.css',
})
export class FamilyList implements OnInit {

  familyAccountNumber = '';

  familyMembers: any[] = [];

  selectedMember: any = null;

  editMode = false;

  editMemberData: any = null;

  loading = false;

  saving = false;

  deleting = false;

  errorMessage = '';

  successMessage = '';

  // =====================================================
  // DELETE CONFIRMATION
  // =====================================================

  showDeletePopup = false;

  memberToDelete: any = null;


  constructor(
    private familyMemberService: FamilyMemberService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

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


  // =====================================================
  // LOAD FAMILY MEMBERS
  // =====================================================

  loadFamilyMembers(): void {

    this.loading = true;

    this.errorMessage = '';

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


  // =====================================================
  // VIEW MEMBER
  // =====================================================

  viewMember(member: any): void {

    this.selectedMember = member;

    this.editMode = false;

    this.cdr.detectChanges();
  }


  // =====================================================
  // CLOSE MEMBER
  // =====================================================

  closeMember(): void {

    this.selectedMember = null;

    this.cdr.detectChanges();
  }


  // =====================================================
  // EDIT MEMBER
  // =====================================================

  editMember(member: any): void {

    this.selectedMember = null;

    this.editMode = true;

    this.editMemberData = {
      ...member
    };

    this.errorMessage = '';

    this.successMessage = '';

    this.cdr.detectChanges();
  }


  // =====================================================
  // UPDATE MEMBER
  // =====================================================

  updateMember(): void {

    this.errorMessage = '';

    this.successMessage = '';

    if (!this.editMemberData) {
      return;
    }


    if (
      !this.editMemberData.fullName ||
      !this.editMemberData.fullName.trim()
    ) {

      this.errorMessage =
        'Full Name is required.';

      return;
    }


    if (!this.editMemberData.relationship) {

      this.errorMessage =
        'Relationship is required.';

      return;
    }


    if (!this.editMemberData.dateOfBirth) {

      this.errorMessage =
        'Date of Birth is required.';

      return;
    }


    if (!this.editMemberData.gender) {

      this.errorMessage =
        'Gender is required.';

      return;
    }


    if (!this.editMemberData.phoneNumber) {

      this.errorMessage =
        'Phone Number is required.';

      return;
    }


    if (!this.editMemberData.aadhaarNumber) {

      this.errorMessage =
        'Aadhaar Number is required.';

      return;
    }


    if (!this.editMemberData.panNumber) {

      this.errorMessage =
        'PAN Number is required.';

      return;
    }


    this.saving = true;


    const memberId =
      this.editMemberData.id;


    const updateData = {

      fullName:
        this.editMemberData.fullName,

      relationship:
        this.editMemberData.relationship,

      dateOfBirth:
        this.editMemberData.dateOfBirth,

      gender:
        this.editMemberData.gender,

      phoneNumber:
        this.editMemberData.phoneNumber,

      email:
        this.editMemberData.email,

      occupation:
        this.editMemberData.occupation,

      aadhaarNumber:
        this.editMemberData.aadhaarNumber,

      panNumber:
        this.editMemberData.panNumber,

      photo:
        this.editMemberData.photo

    };


    console.log(
      'Updating family member:',
      updateData
    );


    this.familyMemberService
      .updateFamilyMember(
        this.familyAccountNumber,
        memberId,
        updateData
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Update response:',
            response
          );

          this.saving = false;

          this.editMode = false;

          this.editMemberData = null;

          this.successMessage =
            'Family Member Updated Successfully';

          this.loadFamilyMembers();

          this.cdr.detectChanges();
        },


        error: (error: any) => {

          console.error(
            'Failed to update family member:',
            error
          );

          this.saving = false;

          this.errorMessage =
            error.error?.message ||
            'Failed to update family member.';

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  cancelEdit(): void {

    this.editMode = false;

    this.editMemberData = null;

    this.errorMessage = '';

    this.cdr.detectChanges();
  }


  // =====================================================
  // OPEN DELETE CONFIRMATION
  // =====================================================

  confirmDelete(member: any): void {

    // Do not allow Family Head to be deleted
    if (member.role === 'FAMILY_HEAD') {

      this.errorMessage =
        'Family Head cannot be deleted.';

      return;
    }

    this.errorMessage = '';

    this.successMessage = '';

    this.memberToDelete = member;

    this.showDeletePopup = true;

    this.cdr.detectChanges();
  }


  // =====================================================
  // CANCEL DELETE
  // =====================================================

  cancelDelete(): void {

    this.showDeletePopup = false;

    this.memberToDelete = null;

    this.deleting = false;

    this.cdr.detectChanges();
  }


  // =====================================================
  // DELETE MEMBER
  // =====================================================

  deleteMember(): void {

    if (!this.memberToDelete) {
      return;
    }

    const memberId =
      this.memberToDelete.id;


    if (!memberId) {

      this.errorMessage =
        'Member ID not found. Cannot delete member.';

      this.cancelDelete();

      return;
    }


    this.deleting = true;

    this.errorMessage = '';

    this.successMessage = '';


    console.log(
      'Deleting family member:',
      memberId
    );


    this.familyMemberService
      .deleteFamilyMember(
        this.familyAccountNumber,
        memberId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Delete response:',
            response
          );

          this.deleting = false;

          this.showDeletePopup = false;

          this.memberToDelete = null;

          this.successMessage =
            'Family Member Deleted Successfully';

          // Reload the list from MongoDB
          this.loadFamilyMembers();

          this.cdr.detectChanges();
        },


        error: (error: any) => {

          console.error(
            'Failed to delete family member:',
            error
          );

          this.deleting = false;

          this.errorMessage =
            error.error?.message ||
            'Failed to delete family member.';

          this.showDeletePopup = false;

          this.memberToDelete = null;

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // ROLE DISPLAY
  // =====================================================

  getRoleDisplay(role: string): string {

    if (role === 'FAMILY_HEAD') {

      return 'Family Head';
    }

    if (role === 'FAMILY_MEMBER') {

      return 'Family Member';
    }

    return role || 'Not Assigned';
  }


  // =====================================================
  // ROLE BADGE CLASS
  // =====================================================

  getRoleBadgeClass(role: string): string {

    if (role === 'FAMILY_HEAD') {

      return 'role-head';
    }

    if (role === 'FAMILY_MEMBER') {

      return 'role-member';
    }

    return 'role-unknown';
  }


  // =====================================================
  // NUMBER VALIDATION
  // =====================================================

  allowOnlyNumbers(event: KeyboardEvent): void {

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