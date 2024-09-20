// lista-presentes.component.ts
import { Component, OnInit } from '@angular/core';
import { GoogleSheetsService } from '../services/google-sheets.service';

@Component({
  selector: 'app-lista-presentes',
  templateUrl: './lista-presentes.component.html',
  styleUrls: ['./lista-presentes.component.css']
})
export class ListaPresentesComponent implements OnInit {
  items: any[] = [];

  constructor(private sheetsService: GoogleSheetsService) {}

  ngOnInit() {
    this.sheetsService.getItems().subscribe((data: any) => {
      // Parseando os dados da planilha
      const rows = data.values;
      this.items = rows.map((row: any) => ({
        id: row[0], // ID
        name: row[1], // Nome do item
        quantidade: row[2] || 0, // Nome da pessoa que reservou
      }));
    });
  }

  reserveItem(item: any) {
    if (item.reservedBy) return; // Se já estiver reservado, não fazer nada
    const name = prompt('Digite seu nome para reservar este presente:');
    if (name) {
      this.sheetsService.reserveItem(item.id, name).subscribe(() => {
        item.quantidade = name; // Atualiza localmente
      });
    }
  }
}
