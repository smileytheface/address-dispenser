import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from '../shared/models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private isAuthenticated: boolean;
  private userId: string;
  private authStatusListener: Subject<boolean> = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string {
    return this.token;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signIn(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/users/signin',
        authData
      )
      .subscribe((result) => {
        console.log(result);
        const token = result.token;
        this.token = token;
        if (token) {
          // Save token info in service and set expiration timer
          const expiresInDuration = result.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = result.userId;
          this.authStatusListener.next(true);

          // Get expiration date to save in local storage
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );

          // Save token user id and expiration date in local storage
          this.saveAuthData(this.token, this.userId, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/sign-in']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      // this.logout();
    }, duration * 1000);
  }

  // Save token user id and expiration date in local storage
  private saveAuthData(token: string, userId: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  // Clear token user id and expiration date from local storage
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
  }
}
