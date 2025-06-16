import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';

import { DashboardService } from './dashboard.service';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/user.interfaces';
import { UserListComponent } from '../UserList/user-list.component';
import { UserSearchPipe } from '../pipes/user-search.pipe';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, UserListComponent, UserSearchPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  public users = inject(DashboardService).getUsers();
  public searchText = '';
  public user: IUser = { name: '', email: '', id: '' };
  public username = '';

  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  ngOnInit(): void {
    const current = this.authService.currentUser();
    this.username = current?.name ?? '';
  }

  public onSubmit(isAdd: boolean): void {
    const currentUsers = this.users();

    if (isAdd) {
      const emailExists = currentUsers.some(
        u => u.email.toLowerCase() === this.user.email.toLowerCase()
      );
      if (emailExists) {
        this.toastr.error('Email already exists!', 'Duplicate Email');
        return;
      }
      this.user.id = uuidv4();
    }

    const action = isAdd
      ? this.dashboardService.addUser(this.user)
      : this.dashboardService.updateUser(this.user);

    action.subscribe(() => {
      this.resetForm();
      this.toastr.success(`User ${isAdd ? 'added' : 'updated'} successfully`, 'Success');
    });
  }

  public editUser(user: IUser): void {
    this.user = { ...user };
  }

  public deleteUser(id: string): void {
    this.dashboardService.deleteUser(id).subscribe();
  }

  public resetForm(): void {
    this.user = { name: '', email: '', id: '' };
  }
}
