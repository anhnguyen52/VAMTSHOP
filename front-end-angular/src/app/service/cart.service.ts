import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiUrl = 'http://localhost:9999/api/cart';

  getCartByUserId(user_id: string) {
    return this.http.get<any>(`${this.apiUrl}/${user_id}`);
  }

  addToCart(user_id: string, product_id:string, size: string | null, quantity: number, price: number): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/addItem/${user_id}`,{product_id, size, quantity, price});
  }

  removeFromCart(user_id: string, product_id:string, size: string): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/removeQuantityItem/${user_id}/${product_id}`,{ size });
  }

  deleteFromCart(user_id: string, product_id:string, size : string): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/deleteItemFromCart/${user_id}/${product_id}`, { params: { size } });
  }
  
  mergeCart(user_id: string, localCart:[any]):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/mergeCart/${user_id}`, localCart);
  }
}
