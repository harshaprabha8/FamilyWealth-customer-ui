import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  private apiUrl =
    'http://localhost:8080/api/bank-accounts';

  constructor(
    private http: HttpClient
  ) {}

  openBankAccount(
    familyAccountNumber: string,
    accountData: any
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/${familyAccountNumber}`,
      accountData
    );
  }

  getBankAccount(
    familyAccountNumber: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${familyAccountNumber}`
    );
  }
}