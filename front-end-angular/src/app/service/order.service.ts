import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor( private http: HttpClient) { }

  private API_URL = 'http://localhost:9999/api/order';

  getAllOrder(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getAllOrders`);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getDetails/${id}`);
  }

  getMyOrder(userId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getMyOrders`, { params: { userId } });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/create`, orderData);
  }

  updateStatus(orderId: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/updateStatus/${orderId}`, { status });
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/cancel/${orderId}`, {});
  }


  confirmOrder(orderId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/confirm/${orderId}`, {});
  }

  updateBoxInfo(orderId: string, boxInfo: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/updateBoxInfo/${orderId}`, boxInfo);
  }

}
