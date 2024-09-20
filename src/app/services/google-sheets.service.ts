import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleSheetsService {
  private sheetId = environment.sheetId; // Substitua pelo ID da sua planilha
  private apiKey = environment.apiKey; // Substitua pela sua chave de API

  private baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Presentes!A1:C100`; // Define o intervalo da planilha (ajuste conforme sua estrutura)

  constructor(private http: HttpClient) {}

  // Método para buscar os itens
  getItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}?key=${this.apiKey}`);
  }

  // Método para atualizar o status de um item
  reserveItem(row: number, name: string): Observable<any> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Presentes!C${row}:C${row}?valueInputOption=RAW`;
    const body = { values: [[name]] };
    return this.http.put(`${url}&key=${this.apiKey}`, body);
  }
}
