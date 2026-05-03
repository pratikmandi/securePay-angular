import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.http.get('http://localhost:5050/auth/user', {
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
