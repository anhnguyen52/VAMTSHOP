import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleCampaignService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:9999/api/saleCampaign';

  createCampaign(campaignData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, campaignData);
  }

  updateCampaign(id: string, campaignData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, campaignData);
  }

  deleteCampaign(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getAllCampaigns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }

  getCampaignById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getById/${id}`);
  }

  getProductsInCampaign(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getProductsInCampaign/${id}`);
  }

  checkProductConflicts(conflictData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-conflicts`, conflictData);
  }

  checkProductConflictsPreview(conflictData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-conflicts-preview`, conflictData);
  }
}
