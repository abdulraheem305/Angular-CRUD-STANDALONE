import {
  Component,
  OnInit,
  inject,
  signal,
  effect,
  runInInjectionContext,
  EnvironmentInjector
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard/dashboard.service';
import { CombinedData } from '../interfaces/combinedData.interfaces';

@Component({
  selector: 'app-user-combined',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-combined.component.html',
  styleUrls: ['./user-combined.component.scss'],
  providers: [DashboardService]
})
export class UserCombinedComponent implements OnInit {
  readonly combinedData = signal<CombinedData[]>([]);
  private readonly dashboardService = inject(DashboardService);
  private readonly injector = inject(EnvironmentInjector); 

  ngOnInit(): void {
    this.dashboardService.getAccounts().subscribe(accounts => {
      runInInjectionContext(this.injector, () => {
        effect(() => {
          const users = this.dashboardService.getUsers()();
          const maxLength = Math.max(users.length, accounts.length);

          this.combinedData.set(
            Array.from({ length: maxLength }, (_, i) => ({
              email: users[i]?.email ?? 'N/A',
              name: accounts[i]?.name ?? 'N/A'
            }))
          );
        });
      });
    });
  }
}
