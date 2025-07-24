import { Directive, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyShift]',
  standalone: true,
})
export class CurrencyShiftDirective {
  private digitBuffer: string = '';

  constructor(@Self() private ngControl: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key >= '0' && event.key <= '9') {
      event.preventDefault();
      this.digitBuffer += event.key;
      this.updateValue();
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      this.digitBuffer = this.digitBuffer.slice(0, -1);
      this.updateValue();
    }

    if (event.key === 'Delete' || event.key === 'Escape') {
      event.preventDefault();
      this.digitBuffer = '';
      this.updateValue();
    }
  }

  @HostListener('click')
  onClick() {
    const currentValue = this.ngControl.control?.value;
    if (currentValue === 0 || currentValue === null) {
      this.digitBuffer = '';
    } else {
      this.digitBuffer = String(currentValue).replace(/\D/g, '');
    }
  }

  private updateValue() {
    const numericValue = Number(this.digitBuffer || '0') / 100;
    this.ngControl.control?.setValue(numericValue);
  }
}