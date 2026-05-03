import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../config/api-url';

export interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  address?: string;
  profession?: string;
  organization?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly base = API_URL;

  private profileCache: UserProfile | null = null;

  constructor(private http: HttpClient) {}

  clearProfileCache(): void {
    this.profileCache = null;
  }

  /**
   * `/user` payload — cached across dashboard tabs until logout or profile update.
   */
  getProfile(force = false): Observable<UserProfile> {
    if (!force && this.profileCache !== null) {
      return of({ ...this.profileCache });
    }
    return this.http
      .get<UserProfile>(`${this.base}/user`, {
        withCredentials: true,
      })
      .pipe(tap((p) => (this.profileCache = { ...p })));
  }

  updateProfile(body: {
    name?: string;
    address?: string;
    profession?: string;
    organization?: string;
  }) {
    return this.http
      .patch<UserProfile>(`${this.base}/user/profile`, body, {
        withCredentials: true,
      })
      .pipe(tap((p) => (this.profileCache = { ...p })));
  }

  logout() {
    return this.http
      .post<{ message: string }>(
        `${this.base}/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(tap(() => (this.profileCache = null)));
  }
}
