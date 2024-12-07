import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';
import { JsonPipe } from '@angular/common';
import { takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'webapp';

  destroyRef = inject(DestroyRef);

  loginResponse: LoginResponse = {
    isAuthenticated: false,
    userData: undefined,
    accessToken: '',
    idToken: '',
  };

  constructor(private oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService
      .checkAuth()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated) => {
        console.log('app authenticated', isAuthenticated);
        console.log('environment.production', environment.production);
        this.loginResponse = isAuthenticated;
      });
  }

  login() {
    this.oidcSecurityService.authorize();
  }
  logout() {
    this.oidcSecurityService.logoff().subscribe((x) => console.log(x));
  }
}
