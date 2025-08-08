import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('access_token');
      console.log("isLoggedIn: ", isLoggedIn);
      if (isLoggedIn) {
        return true;
      } else {
        this.router.navigate(['/Login']);
        return false;
      }
    } else {
      return false;
    }
  }
}
