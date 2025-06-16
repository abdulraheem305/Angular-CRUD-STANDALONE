import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/sharedHeader/header.component';
import { SidebarComponent } from '../shared/shard-sidebar/sidebar.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);

  private readonly _username = signal('');
  private readonly _encryptedId = signal('');


  readonly username = computed(() => this._username());
  readonly encryptedId = computed(() => this._encryptedId());

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      this._username.set(user?.name ?? '');
      this._encryptedId.set(this.authService.getEncryptedId() ?? '');
    });
  }
}
