import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule, Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CurrencyShiftDirective } from '../../directives/currency-shift.directive';

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
  selector: 'app-home',
  imports: [ AutoComplete, InputNumberModule, ReactiveFormsModule, TableModule, IftaLabelModule, ButtonModule, CurrencyShiftDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('dt') dt!: Table;

  productForm: FormGroup;

  items: any[] = [];
  productList: Product[] = [];
  initialValue: Product[] = [];
  total: number = 0;
  isSorted: boolean | null = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  search(event: AutoCompleteCompleteEvent) {
    this.items = products.map((item) => ( item.name )).filter((item) =>
      item.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  addProduct() {
    if (this.productForm.invalid) {
      return;
    }

    const formValue = this.productForm.getRawValue();

    this.productList.unshift({ name: formValue.productName, price: formValue.productPrice, qtd: formValue.quantity });
    this.initialValue.unshift({ name: formValue.productName, price: formValue.productPrice, qtd: formValue.quantity });
    this.total += formValue.productPrice * formValue.quantity;

    this.productForm.reset({
      productName: '',
      productPrice: 0,
      quantity: 1
    });
  }

  removeProduct(product: Product) {
    this.total -= product.price * product.qtd;
    const indexInList = this.productList.indexOf(product);
    if (indexInList > -1) {
      this.productList.splice(indexInList, 1);
    }

    const indexInInitial = this.initialValue.indexOf(product);
    if (indexInInitial > -1) {
      this.initialValue.splice(indexInInitial, 1);
    }
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
