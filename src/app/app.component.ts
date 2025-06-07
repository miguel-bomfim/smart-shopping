import { Component } from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

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
	imports: [NgbTypeaheadModule, FormsModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
  model: any;
  price: any;
  productList: { name: string, price: number }[] = [];
  total: number = 0;

	search: OperatorFunction<string, readonly { name: string }[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map((term) =>
				term === '' ? [] : products.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
		);

	formatter = (x: { name: string }) => x.name;

  addProduct(name: any, priceInput: string) {
    if (!name || !priceInput) return;

    const cleanPrice = parseFloat(priceInput.replace(',', '.'));
    if (isNaN(cleanPrice)) return;

    const productName = typeof name === 'string' ? name : name.name;

    this.productList.push({ name: productName, price: cleanPrice });
    this.total += cleanPrice;

    this.model = '';
    this.price = '';
  }

  removeProduct(index: number) {
    const price = this.productList[index].price;
    this.total -= price;
    this.productList.splice(index, 1);
  }


}
