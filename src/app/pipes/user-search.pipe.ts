import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from "../interfaces/user.interfaces"

@Pipe({
  name: 'userSearch',
  standalone: true,
})
export class UserSearchPipe implements PipeTransform {
  transform(users: IUser[], searchText: string): IUser[] {
    if (!users || !searchText) return users;

    searchText = searchText.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
    );
  }
}
