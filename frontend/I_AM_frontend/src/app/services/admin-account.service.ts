import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserDTO {
  idUser?: number;
  fullName: string;
  email: string;
  password?: string;
  username: string;
  createAt: string;
  idRole?: number;
  nameRole: string;
} 

export interface UserUpdateDTO {
  fullName: string;
  nameRole: string;
}

export interface ChangePasswordDTO {
  newPassword: string;
  confirmPassword: string;
}


export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page number
}

@Injectable({
  providedIn: 'root'
})
export class AdminAccountService {
  private apiUrl = 'http://localhost:8080/admin/account';

  constructor(private http: HttpClient) {}

  getAccounts(keyword: string, role: string, page: number, pageSize: number): Observable<PageResponse<UserDTO>> {
    return this.http.get<PageResponse<UserDTO>>(`${this.apiUrl}?keyword=${keyword}&role=${role}&page=${page}&size=${pageSize}`);
  }

  createAccount(user: UserDTO): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateAccount(id: number, user: UserUpdateDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  changePassword(id: number, dto: ChangePasswordDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/change-password`, dto);
  }
}
