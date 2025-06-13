import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { combineLatest, delay, forkJoin, from, of } from 'rxjs';

@Component({
  selector: 'app-advanced-tax-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-tax-calculator.component.html',
  styleUrls: ['./advanced-tax-calculator.component.css']
})
export class AdvancedTaxCalculatorComponent {
  taxForm: FormGroup;
  taxAmount: number | null = null;
  monthlyTax: number | null = null;
  mode: 'monthly' | 'yearly' = 'yearly';

  constructor(private  readonly fb: FormBuilder) {
    this.taxForm = this.fb.group({
      income: [0],
      mode: ['yearly']
    });
  }

  calculateTax(): void {
    const data= false;
    if(!data) return;
    const income = this.taxForm.value.income;
    this.mode = this.taxForm.value.mode;
    this.taxAmount = this.getTax2026(income);
    this.monthlyTax= this.mode === 'monthly'?this.taxAmount / 12:null;
    
  }

  getTax2026(income: number): number {
    if (income <= 600000) return 0;
    else if (income <= 1200000) return (income - 600000) * 0.01;
    else if (income <= 1800000) return 6000 + (income - 1200000) * 0.05;
    else if (income <= 2400000) return 36000 + (income - 1800000) * 0.075;
    else if (income <= 3000000) return 81000 + (income - 2400000) * 0.11;
    else if (income <= 3600000) return 147000 + (income - 3000000) * 0.13;
    else if (income <= 4200000) return 225000 + (income - 3600000) * 0.15;
    else if (income <= 4800000) return 315000 + (income - 4200000) * 0.175;
    else if (income <= 5400000) return 420000 + (income - 4800000) * 0.20;
    else if (income <= 6000000) return 540000 + (income - 5400000) * 0.225;
    else return 675000 + (income - 6000000) * 0.25;
  }
}
