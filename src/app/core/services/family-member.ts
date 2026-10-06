import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyMemberService {

  private apiUrl =
    'http://localhost:8080/api/family-members';

  constructor(
    private http: HttpClient
  ) {}


  // ============================================================
  // ADD FAMILY MEMBER
  // ============================================================

  addFamilyMember(
    familyAccountNumber: string,
    memberData: any
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/${familyAccountNumber}`,
      memberData
    );

  }


  // ============================================================
  // GET ALL FAMILY MEMBERS
  // ============================================================

  getFamilyMembers(
    familyAccountNumber: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/${familyAccountNumber}`
    );

  }


  // ============================================================
  // UPDATE FAMILY MEMBER
  // ============================================================

  updateFamilyMember(
    familyAccountNumber: string,
    memberId: string,
    memberData: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${familyAccountNumber}/${memberId}`,
      memberData
    );

  }


  // ============================================================
  // DELETE FAMILY MEMBER
  // ============================================================

  deleteFamilyMember(
    familyAccountNumber: string,
    memberId: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${familyAccountNumber}/${memberId}`
    );

  }

}