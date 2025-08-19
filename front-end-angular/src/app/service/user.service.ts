import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = 'http://localhost:9999/api/user';

  getAllUsers():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getAll`);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-user/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-user/${id}`);
  }

  getUserProfile(id:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-details/${id}`,{});
  }

}
