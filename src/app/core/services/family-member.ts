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

  addFamilyMember(
    familyAccountNumber: string,
    memberData: any
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/${familyAccountNumber}`,
      memberData
    );
  }

  getFamilyMembers(
    familyAccountNumber: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/${familyAccountNumber}`
    );
  }
}