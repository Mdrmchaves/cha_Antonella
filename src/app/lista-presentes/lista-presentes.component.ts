import { Component, OnInit } from '@angular/core';
import { GoogleSheetsService } from '../services/google-sheets.service';

@Component({
  selector: 'app-lista-presentes',
  templateUrl: './lista-presentes.component.html',
  styleUrls: ['./lista-presentes.component.css'],
})
export class ListaPresentesComponent implements OnInit {
  items: any[] = []; // Lista de itens da planilha
  personName: string = ''; // Nome da pessoa que fará a reserva
  itemId: string = ''; // ID do item a ser reservado
  reservedQuantity: number = 1; // Quantidade a ser reservada

  constructor(private sheetsService: GoogleSheetsService) {}

  ngOnInit() {
    this.fetchItems(); // Carregar os itens na inicialização
  }

  // Buscar itens da planilha de presentes
  fetchItems() {
    this.sheetsService.getItemsData().then(response => {
      this.items = response.values;
      console.log('Itens obtidos com sucesso:', this.items);
    }).catch(error => {
      console.error('Erro ao buscar itens:', error);
    });
  }

  // Fazer uma reserva
  reserveItem() {
    const selectedItem = this.items.find(item => item[0] === this.itemId);
    if (!selectedItem) {
      console.error('Item não encontrado');
      return;
    }

    const remainingQuantity = selectedItem[2] - this.reservedQuantity;

    if (remainingQuantity < 0) {
      console.error('Quantidade indisponível');
      return;
    }

    // Atualizar quantidade no inventário
    this.sheetsService.updateItemQuantity(this.itemId, remainingQuantity).then(() => {
      // Adicionar a reserva
      return this.sheetsService.addReservation(this.personName, this.itemId, this.reservedQuantity);
    }).then(() => {
      console.log('Reserva realizada com sucesso');
      this.fetchItems(); // Atualizar a lista de itens
    }).catch(error => {
      console.error('Erro ao realizar a reserva:', error);
    });
  }
}
