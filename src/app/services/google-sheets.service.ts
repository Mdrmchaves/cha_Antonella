/* import { Injectable } from '@angular/core';
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
} */

  import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

  declare const gapi: any;
  
  @Injectable({
    providedIn: 'root'
  })
  export class GoogleSheetsService {
    private CLIENT_ID = environment.clientId; // Substitua pelo seu Client ID
    private SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
    private sheetId = environment.sheetId; // Substitua pelo ID da sua planilha
    private apiKey = environment.apiKey; // Substitua pela sua chave de API
  
    constructor() {
      this.loadGapi();
    }
  
    loadGapi() {
      gapi.load('client:auth2', () => {
        gapi.auth2.init({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES,
        });
      });
    }
  
    async authenticate() {
      try {
        console.log(gapi.auth2)
        const user = await gapi.auth2.getAuthInstance().signIn();
        return user.getAuthResponse().access_token;
      } catch (error) {
        console.error('Erro ao autenticar', error);
      }
    }

    async getItemsData() {
      const accessToken = await this.authenticate();
      const range = 'Presentes!A:C'; // Onde A é o ID, B é o nome e C é a quantidade
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}`;
    
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
      if (!response.ok) {
        throw new Error('Erro ao buscar dados: ' + response.statusText);
      }
    
      return response.json();
    }

    async updateItemQuantity(itemId: string, newQuantity: number) {
      const accessToken = await this.authenticate();
      const range = 'Presentes!A:C'; // Intervalo da planilha de presentes
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
  
      const currentData = await this.getItemsData();
      const values = currentData.values || [];
  
      const itemIndex = values.findIndex((row:any) => row[0] === itemId);
      if (itemIndex !== -1) {
        values[itemIndex][2] = newQuantity; // Atualiza a quantidade na terceira coluna
      } else {
        console.error('Item não encontrado');
        return;
      }
  
      const body = {
        values: values,
      };
  
      return fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    }

    async addReservation(personName: string, itemId: string, reservedQuantity: number) {
      const accessToken = await this.authenticate();
      const range = 'Pessoas!A:C'; // Onde A é o nome da pessoa, B é o ID do item, e C é a quantidade reservada
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
    
      const body = {
        values: [[personName, itemId, reservedQuantity]],
      };
    
      return fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    }
    
    
  }
  
