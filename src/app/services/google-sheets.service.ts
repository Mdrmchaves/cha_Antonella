import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Item, PersonModel } from '../models/sheet.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleSheetsService {
  public server: HttpClient;


  constructor(private http: HttpClient) {
    this.server = this.http;
  }

  createItem(
    id: number,
    name: string,
    platform: string,
    technology: string,
    link: string
  ): Observable<Item> {
    return this.http.post<Item>(`${environment.CONNECTION_URL}`, {
      id,
      name,
      platform,
      technology,
      link,
    });
  }

  listItem(): Observable<Array<Item>> {
    return this.server.get<Array<Item>>(`${environment.CONNECTION_URL}`);
  }

  getItemDataById(id: number) {
    return this.server.get(`${environment.CONNECTION_URL}/${id}`);
  }

  updateItem(
    id: number,
    name: string,
    quantidadeRestante: number
  ): Observable<Item> {
    return this.server.put<Item>(`${environment.CONNECTION_URL}/${id}`, {
      id,
      name,
      quantidadeRestante
    });
  }

/* Person Region */

createPerson(
  name: string,
  itemName: string,
  quantidade: number,
): Observable<PersonModel> {
  console.log(name)
  return this.server.post<PersonModel>(`${environment.CONNECTION_URL2}`, {
    name,
    itemName,
    quantidade
  });
}

}












