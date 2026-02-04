import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contactId?: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
}

export interface ContactsResponse {
  success: boolean;
  count: number;
  contacts: Contact[];
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl + '/contact';

  constructor(private http: HttpClient) { }

  /**
   * Submit contact form
   */
  submitContactForm(formData: ContactForm): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, formData);
  }

  /**
   * Get all contacts (admin only)
   */
  getAllContacts(): Observable<ContactsResponse> {
    return this.http.get<ContactsResponse>(this.apiUrl);
  }

  /**
   * Get contact by ID (admin only)
   */
  getContactById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Delete contact (admin only)
   */
  deleteContact(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}