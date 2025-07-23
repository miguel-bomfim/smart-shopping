import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

interface Product {
  name: string;
  price: number;
  qtd: number;
}

const products: { name: string }[] = [
	{ name: 'Achocolatado' },
	{ name: 'Alface' },
	{ name: 'Alho' },
	{ name: 'Amaciante' },
	{ name: 'Arroz' },
	{ name: 'Água mineral' },
	{ name: 'Banana' },
	{ name: 'Batata' },
	{ name: 'Biscoito' },
	{ name: 'Café' },
	{ name: 'Carne bovina' },
	{ name: 'Cebola' },
	{ name: 'Cenoura' },
	{ name: 'Cerveja' },
	{ name: 'Chocolate' },
	{ name: 'Creme dental' },
	{ name: 'Detergente' },
	{ name: 'Escova de dentes' },
	{ name: 'Farinha de trigo' },
	{ name: 'Feijão' },
	{ name: 'Fraldas' },
	{ name: 'Frango' },
	{ name: 'Iogurte' },
	{ name: 'Laranja' },
	{ name: 'Leite' },
	{ name: 'Leite em pó' },
	{ name: 'Linguiça' },
	{ name: 'Macarrão' },
	{ name: 'Maçã' },
	{ name: 'Manteiga' },
	{ name: 'Margarina' },
	{ name: 'Molho de tomate' },
	{ name: 'Ovos' },
	{ name: 'Óleo de soja' },
	{ name: 'Papel higiênico' },
	{ name: 'Peixe' },
	{ name: 'Pizza congelada' },
	{ name: 'Pão de forma' },
	{ name: 'Presunto' },
	{ name: 'Queijo' },
	{ name: 'Refrigerante' },
	{ name: 'Sabão em pó' },
	{ name: 'Sabonete' },
	{ name: 'Sal' },
	{ name: 'Shampoo' },
	{ name: 'Sorvete' },
	{ name: 'Suco' },
	{ name: 'Tomate' }
];

@Component({
	selector: 'app-root',
	imports: [FormsModule, AutoComplete, InputNumber, TableModule, IftaLabelModule, ButtonModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})

export class AppComponent {
  @ViewChild('dt') dt!: Table;
  items: any[] = [];
  productName: string = '';
  productPrice: number | null = null;
  quantity: number = 1;
  productList: Product[] = [];
  total: number = 0;
  initialValue: Product[] = [];
  isSorted: boolean | null = null;

  search(event: AutoCompleteCompleteEvent) {
    this.items = products.map((item) => ( item.name )).filter((item) =>
      item.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  addProduct(name: any, priceInput: number | null, qtd: number) {
    if (!name || !priceInput) return;

    const productName = typeof name === 'string' ? name : name.name;

    this.productList.unshift({ name: productName, price: priceInput, qtd: qtd });
    this.initialValue.unshift({ name: productName, price: priceInput, qtd: qtd });
    this.total += priceInput * qtd;

    this.productName = '';
    this.productPrice = null;
    this.quantity = 1;
  }

  removeProduct(product: Product) {
    const price = product.price;
    this.total -= price * product.qtd;
    this.productList.splice(this.productList.indexOf(product), 1);
    this.initialValue.splice(this.productList.indexOf(product), 1);
  }

    customSort(event: SortEvent) {
      if (this.isSorted == null || this.isSorted === undefined) {
          this.isSorted = true;
          this.sortTableData(event);
      } else if (this.isSorted == true) {
          this.isSorted = false;
          this.sortTableData(event);
      } else if (this.isSorted == false) {
          this.isSorted = null;
          this.productList = [...this.initialValue];
          this.dt?.reset();
      }
    }

    sortTableData(event: any) {
      event.data.sort((data1: any, data2: any) => {
          let value1 = data1[event.field];
          let value2 = data2[event.field];
          let result = null;
          if (value1 == null && value2 != null) result = -1;
          else if (value1 != null && value2 == null) result = 1;
          else if (value1 == null && value2 == null) result = 0;
          else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
          else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

          return event.order * result;
      });
    }

}
