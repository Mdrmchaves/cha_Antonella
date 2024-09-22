import { Component, OnInit } from '@angular/core';
import { GoogleSheetsService } from '../services/google-sheets.service';
import { Item, PersonModel } from '../models/sheet.model';

@Component({
  selector: 'app-lista-presentes',
  templateUrl: './lista-presentes.component.html',
  styleUrls: ['./lista-presentes.component.css'],
})
export class ListaPresentesComponent implements OnInit {
  items: Item[] = []; // Lista de itens da planilha
  item: Item = new Item();
  range: number[] = [];

  person: PersonModel = new PersonModel()

  constructor(
    private sheetsService: GoogleSheetsService
  ) {}

  ngOnInit() {
    this.fetchItems(); // Carregar os itens na inicialização
  }

  // Buscar itens da planilha de presentes
  fetchItems() {
    this.sheetsService.listItem().subscribe({next: response => {
          this.items = response;
        },
        error: error => {
          console.error('Erro ao buscar itens:', error);
        }
    });
  }

  isModalOpen = false;

  openModal(item: Item) {
    let i = item.quantidadeRestante.toString();
    this.item = item;
    this.range = [...Array(parseInt(i)).keys()];
    this.isModalOpen = true;

  }

  closeModal() {
    this.item = new Item();
    this.person = new PersonModel();
    this.isModalOpen = false;
  }

  // Fazer uma reserva
  public reserveItem(){
    this.person.itemName = this.item.name;
    this.item.quantidadeRestante -= this.person.quantidade;
        if(this.person != null){
          try{
            this.sheetsService.updateItem(this.item.id,this.item.name,this.item.quantidadeRestante).subscribe({
              next: res => {
                this.sheetsService.createPerson(this.person.personName,this.person.itemName,this.person.quantidade).subscribe({next: res => {this.closeModal(); this.fetchItems()}});
              }
            })
          }catch{
            console.log("Deu ruim");
            this.closeModal();
            this.fetchItems();
          }
        }
  }  


}
