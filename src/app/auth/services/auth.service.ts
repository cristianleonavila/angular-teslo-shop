import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response';
import { User } from '@auth/interfaces/user';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');

  private _user = signal<User | null>(null);

  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkAuthStatus()
  });

  authStatus = computed<AuthStatus>(() => {
    if ( this._authStatus() === 'checking' ) return 'checking';
    if ( this._user() ) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed(this._user);

  token = computed(this._token);

  isAuthenticated = computed<boolean>(() => {
    return this._authStatus() === 'authenticated';
  });

  isNotAuthenticated = computed<boolean>(() => {
    console.log(this._authStatus());
    return this._authStatus() === 'not-authenticated';
  });


  login (email:string, password:string):Observable<boolean> {
    return this.http.post<AuthResponse>(`${environment.API}/auth/login`, {
      email,
      password
    }).pipe(
      tap( response => this.handleAuth(response)  ),
      map(() => true),
      catchError( error => this.handleAuthError(error))
    );
  }

  checkAuthStatus():Observable<boolean> {
    const token = localStorage.getItem('token');
    if ( !token ) {
      this.logout();
      return of(false);
    }
    return this.http.get<AuthResponse>(`${environment.API}/auth/check-status`).pipe(
      tap( (response) =>  this.handleAuth(response) ),
      map(() => true),
      catchError((error) => this.handleAuthError(error))
    );
  }

  private handleAuth({token, user}: AuthResponse) {
      this._authStatus.set('authenticated');
      this._user.set(user);
      this._token.set(token);
      localStorage.setItem('token', token);
  }

  private handleAuthError(error: any):Observable<boolean> {
    this.logout();
    return of(false);
  }

  logout () {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
  }

}
