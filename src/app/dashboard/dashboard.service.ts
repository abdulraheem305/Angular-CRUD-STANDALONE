import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user.interfaces';
import { environment } from '../../enviornments/enviornment';
import { tap } from 'rxjs';

@Injectable()
export class DashboardService {
  private readonly apiUrl: string = environment.usersUrl;
  private readonly accountsUrl: string = environment.accountsUrl;
  private readonly _users = signal<IUser[]>([]);
  readonly users = computed(() => this._users());

  constructor(private readonly http: HttpClient) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<IUser[]>(this.apiUrl).subscribe({
      next: users => this._users.set(users),
      error: err => console.error('Failed to load users:', err)
    });
  }

  public getUsers() {
    return this.users;
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
