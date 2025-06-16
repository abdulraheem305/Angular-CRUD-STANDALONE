import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { IAuthUser } from '../interfaces/auth.interfaces';
import { encryptId } from '../utils/encryption';
import { environment } from '../../enviornments/enviornment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.baseUrl;
  private currentUserSignal = signal<IAuthUser | null>(null);
  private encryptedId: string | null = null;

  constructor(private http: HttpClient) {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSignal.set(user);
      this.encryptedId = encryptId(user.id);
    }
  }


  get currentUser() {
    return this.currentUserSignal;
  }

  public login(email: string, password: string): Observable<IAuthUser> {
    return this.http
      .get<IAuthUser[]>(`${this.baseUrl}/accounts?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          if (users.length === 0) throw new Error('Invalid credentials');

          const user = users[0];
          const { id, name, email: safeEmail } = user;
          const safeUser: IAuthUser = { id, name, email: safeEmail };

          localStorage.setItem('currentUser', JSON.stringify(safeUser));
          this.currentUserSignal.set(safeUser);
          this.encryptedId = encryptId(id);

          return safeUser;
        }),
        catchError((err) =>
          throwError(() => new Error(err?.message || 'Login failed'))
        )
      );
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
  }

  public signup(user: IAuthUser): Observable<IAuthUser> {
    return this.http.get<IAuthUser[]>(`${this.baseUrl}/accounts?email=${user.email}`).pipe(
      map(existing => {
        if (existing.length > 0) throw new Error('Email already exists');
        return user;
      }),
      switchMap((newUser) =>
        this.http.post<IAuthUser>(`${this.baseUrl}/accounts`, newUser)
      ),
      catchError(err => throwError(() => new Error(err?.message || 'Signup failed')))
    );
  }

  public getCurrentUser(): IAuthUser | null {
    return this.currentUserSignal();
  }

  public getEncryptedId(): string | null {
    return this.encryptedId;
  }
}
