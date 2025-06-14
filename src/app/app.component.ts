import { Component, ViewChild, ElementRef } from '@angular/core';

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
  price: any = '';
  qtd: any;
  productList: { name: string; price: number; qtd: number }[] = [];
  total: number = 0;
  @ViewChild('priceInputRef') priceInputRef!: ElementRef;
  @ViewChild('productInputRef') productInputRef!: ElementRef;

  editIndex: number | null = null;
editName: string = '';
editPrice: string = '';

startEdit(index: number, item: { name: string; price: number }) {
  this.editIndex = index;
  this.editName = item.name;
  this.editPrice = item.price.toString().replace('.', ',');
}

saveEdit(index: number) {
  const updatedPrice = parseFloat(this.editPrice.replace(',', '.'));
  if (isNaN(updatedPrice)) return;

  const oldPrice = this.productList[index].price;

  this.productList[index].name = this.editName;
  this.productList[index].price = updatedPrice;

  // atualiza o total
  this.total += updatedPrice - oldPrice;

  this.editIndex = null;
  this.editName = '';
  this.editPrice = '';
}


  search: OperatorFunction<string, readonly { name: string }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : products
              .filter((v) =>
                v.name.toLowerCase().includes(term.toLowerCase())
              )
              .slice(0, 10)
      )
    );

  formatter = (x: { name: string }) => x.name;

  addProduct(name: any, priceInput: string, qtd: number) {
    if (!name || !priceInput) return;

    // Substitui vírgula por ponto e converte para número
    const cleanPrice = parseFloat(priceInput.replace(',', '.')) * Number(qtd);
    if (isNaN(cleanPrice)) return;

    const productName = typeof name === 'string' ? name : name.name;

    this.productList.unshift({ name: productName, price: cleanPrice, qtd: qtd });
    this.total += cleanPrice;

    this.model = '';
    this.price = '';
    this.qtd = '';
  }

  removeProduct(index: number) {
    const price = this.productList[index].price;
    this.total -= price;
    this.productList.splice(index, 1);
  }

  focusPriceInput() {
    this.priceInputRef.nativeElement.focus();
    this.qtd = 1
  }

  handleEnterOnPrice() {
    this.addProduct(this.model, this.price, this.qtd);
    setTimeout(() => {
      this.productInputRef.nativeElement.focus();
    });
  }

  // Método de formatação do input de preço com máscara "00,00"
  formatPriceInput(event: Event) {
		  const input = event.target as HTMLInputElement;

		  // Remove qualquer caractere não numérico
		  let value = input.value.replace(/\D/g, '');

		  // Remove zeros à esquerda
		  value = value.replace(/^0+/, '');

		  // Se o valor for muito pequeno, preenche com zeros
		  if (value.length < 3) {
		    value = value.padStart(3, '0');
		  }

		  // Insere vírgula antes dos dois últimos dígitos
		  const formatted = value.replace(/(\d+)(\d{2})$/, '$1,$2');

		  input.value = formatted;
		  this.price = formatted;
		}
}
