import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../sharedHeader/header.component";
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common'; 
import { Subject, takeUntil } from 'rxjs';
import { encryptId } from '../utils/encryption';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterModule, HeaderComponent, CommonModule],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})

export class MainLayoutComponent implements OnInit {
  public username = '';
  public encryptedId = '';

  constructor(private authService: AuthService) {}

  public ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.name;
      this.encryptedId = this.authService.getEncryptedId() ?? '';
    }

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.name;
        this.encryptedId = this.authService.getEncryptedId() ?? '';
      }
    });
  }
}
