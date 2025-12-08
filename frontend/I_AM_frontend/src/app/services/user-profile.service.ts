import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserProfile {
  fullName: string;
  birth: string;
  phone: string;
  address: string;
  email: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private baseUrl = 'http://localhost:8080/user';
  constructor(private http:HttpClient) { }

  getUserProfile(): Observable<UserProfile> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<UserProfile>(`${this.baseUrl}/profile`, { headers });
  }

  updateUserProfile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post('http://localhost:8080/user/update', formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token');
    const body = new URLSearchParams();
    body.set('currentPassword', currentPassword);
    body.set('newPassword', newPassword);

    return this.http.post('http://localhost:8080/user/change-password', body.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }


}
