import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interfaces';
import { encryptId } from '../utils/encryption';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  private encryptedId: string | null = null;
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
      this.encryptedId = encryptId(user.id);
    }
  }

  public login(email: string, password: string): Observable<IUser> {
    return this.http.get<IUser[]>(`${this.baseUrl}/accounts?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length === 0) throw new Error('Invalid credentials');
        const user = users[0];
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.encryptedId = encryptId(user.id);
        return user;
      }),
      catchError(err => throwError(() => new Error(err?.message || 'Login failed')))
    );
  }
  public getEncryptedId(): string | null {
    return this.encryptedId;
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  public signup(user: IUser): Observable<IUser> {
    return this.http.get<IUser[]>(`${this.baseUrl}/accounts?email=${user.email}`).pipe(
      map(existing => {
        if (existing.length > 0) throw new Error('Email already exists');
        return user;
      }),
      switchMap((newUser) =>
        this.http.post<IUser>(`${this.baseUrl}/accounts`, newUser)
      ),
      catchError(err => throwError(() => new Error(err?.message || 'Signup failed')))
    );
  }

  public getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }
}
