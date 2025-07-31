import { Component, ViewChild, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule, Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CurrencyShiftDirective } from '../../directives/currency-shift.directive';
import { SupabaseService } from '../../services/supabase.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

interface Product {
  name: string;
  price: number;
  qtd: number;
}

@Component({
  selector: 'app-home',
  imports: [ AutoComplete, InputNumberModule, ReactiveFormsModule, TableModule, IftaLabelModule, ButtonModule, CurrencyShiftDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  products: { name: string }[] = []
  loading: boolean = false
  productForm: FormGroup;
  items: any[] = [];
  productList: Product[] = [];
  initialValue: Product[] = [];
  total: number = 0;
  isSorted: boolean | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly supabaseService: SupabaseService
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  async getProducts() {
    try {
      this.loading = true;
      const { data, error }: any = await this.supabaseService.supabase
        .from('produto')
        .select('*');

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        return;
      }

      if (data) {
        this.products = data
      }
    } catch (error) {
      console.error('Ocorreu um erro:', error);
    } finally {
      this.loading = false;
    }
  }

  search(event: AutoCompleteCompleteEvent) {
    this.items = this.products.map((item) => ( item.name )).filter((item) =>
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
