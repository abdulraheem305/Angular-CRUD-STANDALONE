import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '../interfaces/user.interfaces';
import { UserService } from './user.service';
import { UserListComponent } from "../UserList/user-list.component"
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { UserSearchPipe } from '../pipes/user-search.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, UserListComponent, UserSearchPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [UserService]
})
export class UserComponent implements OnInit {
  public users: IUser[] = [];
  public user: IUser = { name: '', email: '', id: '' };
  public searchText: string = '';
  public username: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.name;
      }
    });

    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  public onSubmit(isAdd: boolean): void {
    if (isAdd) {
      const emailExists = this.users.some(u => u.email.toLowerCase() === this.user.email.toLowerCase());
      if (emailExists) {
        this.toastr.error('Email already exists!', 'Duplicate Email');
        return;
      }
      this.user.id = uuidv4();
    }

    const action: Observable<IUser> = isAdd
      ? this.userService.addUser(this.user)
      : this.userService.updateUser(this.user);

    action.subscribe(() => {
      this.loadUsers();
      this.resetForm();
      this.toastr.success(`User ${isAdd ? 'added' : 'updated'} successfully`, 'Success');
    });
  }
  public editUser(user: IUser): void {
    this.user = { ...user };
  }

  public deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }

  public resetForm(): void {
    this.user = { name: '', email: '', id: '' };
  }
}
