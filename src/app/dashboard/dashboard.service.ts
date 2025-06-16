// import { BehaviorSubject, Observable, tap } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { IUser } from '../interfaces/user.interfaces';
// import { environment } from '../../enviornments/enviornment';

// @Injectable()
// export class DashboardService {
//   private apiUrl = environment.apiUrl;
//   private accountsUrl = environment.accountsUrl;

//   private usersSubject: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
//   public users$: Observable<IUser[]> = this.usersSubject.asObservable();

//   constructor(private http: HttpClient) {
//     this.loadUsers();
//   }

//   private loadUsers(): void {
//     this.http.get<IUser[]>(this.apiUrl).subscribe({
//       next: users => this.usersSubject.next(users),
//       error: err => console.error('Failed to load users:', err)
//     });
//   }


//   public getUsers(): Observable<IUser[]> {
//     return this.http.get<IUser[]>(this.apiUrl);
//   }

//   public addUser(user: IUser): Observable<IUser> {
//     return this.http.post<IUser>(this.apiUrl, user).pipe(
//       tap(() => this.loadUsers())
//     );
//   }

//   public updateUser(user: IUser): Observable<IUser> {
//     return this.http.put<IUser>(`${this.apiUrl}/${user.id}`, user).pipe(
//       tap(() => this.loadUsers())
//     );
//   }

//   public deleteUser(id: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
//       tap(() => this.loadUsers())
//     );
//   }

//   public getAccounts(): Observable<{ id: string; name: string }[]> {
//     return this.http.get<{ id: string; name: string }[]>(this.accountsUrl);
//   }
// }
import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user.interfaces';
import { environment } from '../../enviornments/enviornment';
import { tap } from 'rxjs';

@Injectable()
export class DashboardService {
  private readonly apiUrl: string = environment.apiUrl;
  private readonly accountsUrl: string = environment.accountsUrl;

  // 🔁 Reactive signal store
  private readonly _users = signal<IUser[]>([]);

  // ✅ Public readonly signal
  readonly users = computed(() => this._users());

  constructor(private readonly http: HttpClient) {
    this.loadUsers(); // Load on service init
  }

  private loadUsers(): void {
    this.http.get<IUser[]>(this.apiUrl).subscribe({
      next: users => this._users.set(users),
      error: err => console.error('Failed to load users:', err)
    });
  }

  public getUsers() {
    return this.users; // return the signal, not observable
  }

  public addUser(user: IUser) {
    return this.http.post<IUser>(this.apiUrl, user).pipe(
      tap(() => this.loadUsers())
    );
  }

  public updateUser(user: IUser) {
    return this.http.put<IUser>(`${this.apiUrl}/${user.id}`, user).pipe(
      tap(() => this.loadUsers())
    );
  }

  public deleteUser(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadUsers())
    );
  }

  public getAccounts() {
    return this.http.get<{ id: string; name: string }[]>(this.accountsUrl);
  }
}
