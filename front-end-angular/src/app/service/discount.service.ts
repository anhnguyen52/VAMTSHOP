import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = "http://localhost:9999/api/discount";

  getAllDiscounts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAll`);
  }

  getDiscountById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getById/${id}`);
  }

  createDiscount(discount: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, discount);
  }

  updateDiscount(id: string, discount: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, discount);
  }

  deleteDiscount(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  getDiscountSuitable(amount: number, userOrderCount: number, cartQuantity: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getSuitable`, {
      params: {
        amount: amount.toString(),
        userOrderCount: userOrderCount.toString(),
        cartQuantity: cartQuantity.toString()
      }
    });
  }

}
