import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '../interfaces/user.interfaces';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  @Input() users: IUser[] = [];
  @Input() searchText: string = '';
  @Output() edit = new EventEmitter<IUser>();
  @Output() delete = new EventEmitter<string>();

  public isModalOpen: boolean = false;
  public selectedUserIdToDelete: string | null = null;

  public onEdit(user: IUser) {
    this.edit.emit(user);
  }

  public openConfirmModal(userId: string) {
    this.selectedUserIdToDelete = userId;
    this.isModalOpen = true;
  }

  public closeModal() {
    this.isModalOpen = false;
    this.selectedUserIdToDelete = null;
  }

  public confirmDelete() {
    if (this.selectedUserIdToDelete) {
      this.delete.emit(this.selectedUserIdToDelete);
    }
    this.closeModal();
  }
}
