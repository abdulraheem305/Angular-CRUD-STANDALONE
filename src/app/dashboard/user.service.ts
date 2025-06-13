import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user.interfaces';

@Injectable()
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private accountsUrl = 'http://localhost:3000/accounts';

  private usersSubject: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
  public users$: Observable<IUser[]> = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<IUser[]>(this.apiUrl).subscribe({
      next: users => this.usersSubject.next(users),
      error: err => console.error('Failed to load users:', err)
    });
  }


  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  public addUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user).pipe(
      tap(() => this.loadUsers())
    );
  }

  public updateUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${user.id}`, user).pipe(
      tap(() => this.loadUsers())
    );
  }

  public deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadUsers())
    );
  }

  public getAccounts(): Observable<{ id: string; name: string }[]> {
    return this.http.get<{ id: string; name: string }[]>(this.accountsUrl);
  }
}
