// lista-presentes.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-lista-presentes',
  templateUrl: './lista-presentes.component.html',
  styleUrls: ['./lista-presentes.component.css']
})
export class ListaPresentesComponent {
  presentes = [
    { nome: 'Bodies de manga curta TAM: RN', quantidade: 6, reservado: false, quemReservou: '' },
    { nome: 'Bodies de manga curta TAM: P', quantidade: 6, reservado: false, quemReservou: '' },
    { nome: 'Calça tipo "mijão" ou culote TAM: RN', quantidade: 4, reservado: false, quemReservou: '' },
    // Adicione todos os itens da lista aqui
  ];

  reservarPresente(presente: any) {
    const nome = prompt('Digite seu nome para reservar este presente:');
    if (nome) {
      presente.reservado = true;
      presente.quemReservou = nome;
    }
  }
}
