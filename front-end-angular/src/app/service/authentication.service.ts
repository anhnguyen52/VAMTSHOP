import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private access_token: string | null = null;
  private refresh_token: string | null = null;

  constructor(private router: Router,
    private http: HttpClient,
  ) { }

  private apiUrl = 'http://localhost:9999/api/user';

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      return true;
    }
    return false;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000); // thời gian hiện tại tính bằng giây
      return decoded.exp < now;
    } catch (e) {
      return true; // Nếu token không decode được thì coi như đã hết hạn
    }
  }

  setToken(access_token: string, refresh_token: string):void{
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    try {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    }
    catch (error) {
      console.error('Error saving token to localStorage', error);
    }
  }

  setAccessToken(access_token: string): void {
    this.access_token = access_token;
    try {
      localStorage.setItem('access_token', access_token);
    } catch (error) {
      console.error('Error saving access token to localStorage', error);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
  

  refreshToken(id: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/refresh-token`,{id}).pipe(
      tap((response: any) => {
        this.setAccessToken(response.data.access_token);
      }))
  }

  login(email: string, password: string): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/login`,{ email, password }).pipe(
      tap((response) => {
        this.setToken(response.data.access_token, response.data.refresh_token);
      })
    );
  }

  signup(first_name: string, last_name: string, gender: string, address: string, date_of_birth: string, phone: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sign-up`, {first_name, last_name, gender, address, date_of_birth, phone, email, password}).pipe(
      tap((response) => {
        this.setToken(response.data.access_token, response.data.refresh_token);
      })
    );
  }


  logout(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout/${id}`,{}).pipe(
      tap(() => {
        this.access_token = null;
        this.refresh_token = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      })
    )
  }

  getUserProfile(id:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-details/${id}`,{});
  }
}
