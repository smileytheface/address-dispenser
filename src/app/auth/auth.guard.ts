import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log(next);
    console.log(state);

    let isAuth = this.authService.getIsAuthenticated();
    console.log(isAuth);
    if (isAuth && state.url === '/sign-in') {
      // If already signed in and router tries to navigate to sign-in, redirect to homepage
      this.router.navigate(['/']);
    } else if (!isAuth && state.url === '/sign-in') {
      // If not signed in and router tries to navigate to sign-in, allow it
      return true;
    } else if (!isAuth) {
      // If not signed in and router tries to navigate to a page other than sign-in, redirect them to sign-in
      this.router.navigate(['/sign-in']);
    }
    return isAuth;
  }
}
