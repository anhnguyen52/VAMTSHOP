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

  getMyOrders(page: number = 1, limit: number = 10) {
    return this.http.get<any>(`${this.API_URL}/getMyOrders`, {
      params: { page, limit }
    });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/create`, orderData);
    // xử lý clear cart khi đăg hàng thành công ở bên backend 
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

  getProvinces(): Observable<any> { 
    return this.http.get<any>('http://localhost:9999/api/ghn/province');
  }

  getDistricts(provinceID: string): Observable<any> {
    return this.http.get<any>('http://localhost:9999/api/ghn/district', { params: { provinceID } });
  }

  getWards(districtID: string): Observable<any> {
    return this.http.get<any>('http://localhost:9999/api/ghn/ward', { params: { districtID } });
  }

  calculateShippingFee(feeData: {
      to_ward_code: string;
      to_district_id: number;
      weight: number;
      insurance_value: number;
    }): Observable<any> {
      return this.http.get<any>('http://localhost:9999/api/ghn/calculate-fee', {
        params: feeData
      });
    }
}
