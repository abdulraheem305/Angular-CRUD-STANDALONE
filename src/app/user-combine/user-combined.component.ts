import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, forkJoin } from 'rxjs';
import { UserService } from '../dashboard/user.service';
import { CombinedData } from '../interfaces/combinedData.interfaces';


@Component({
    selector: 'app-user-combined',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-combined.component.html',
    styleUrls: ['./user-combined.component.scss'],
    providers: [UserService]
})
export class UserCombinedComponent implements OnInit {
    combinedData: CombinedData[] = [];

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        combineLatest({
            users: this.userService.getUsers(),
            accounts: this.userService.getAccounts()
        }).subscribe({
            next: ({ users, accounts }) => {
                const maxLength = Math.max(users.length, accounts.length);

                this.combinedData = Array.from({ length: maxLength }, (_, i) => ({
                    email: users[i]?.email ?? 'N/A',
                    name: accounts[i]?.name ?? 'N/A'
                }));
            },
            error: err => {
                console.error('Error during forkJoin:', err);
            }
        });
    }


}
