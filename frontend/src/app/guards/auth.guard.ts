import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { API_URL } from '../config/api-url';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.http.get(`${API_URL}/user`, {
      withCredentials: true
    }).pipe(

      map(() => true),

      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })

    );
  }
}
