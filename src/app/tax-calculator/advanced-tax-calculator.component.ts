import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type Mode = 'yearly' | 'monthly';

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
  mode: Mode = 'monthly';

  constructor(private readonly fb: FormBuilder) {
    this.taxForm = this.fb.group({
      income: [null, [Validators.required, Validators.min(1)]],
      mode: ['monthly' as Mode]
    });
  }

  calculateTax(): void {
    if (this.taxForm.invalid) {
      this.taxForm.markAllAsTouched();
      return;
    }

    const { income, mode } = this.taxForm.value;
    this.mode = mode;

    const yearlyIncome = mode === 'monthly' ? income * 12 : income;
    this.taxAmount = this.getTax2026(yearlyIncome);
    this.monthlyTax = mode === 'monthly' ? this.taxAmount / 12 : null;
  }

  private getTax2026(income: number): number {
    const brackets = [
      { limit: 600000, base: 0, rate: 0 },
      { limit: 1200000, base: 0, rate: 0.01 },
      { limit: 1800000, base: 6000, rate: 0.05 },
      { limit: 2400000, base: 36000, rate: 0.075 },
      { limit: 3000000, base: 81000, rate: 0.11 },
      { limit: 3600000, base: 147000, rate: 0.13 },
      { limit: 4200000, base: 225000, rate: 0.15 },
      { limit: 4800000, base: 315000, rate: 0.175 },
      { limit: 5400000, base: 420000, rate: 0.20 },
      { limit: 6000000, base: 540000, rate: 0.225 },
      { limit: Infinity, base: 675000, rate: 0.25 }
    ];

    for (let i = 0; i < brackets.length; i++) {
      const current = brackets[i];
      const previousLimit = i === 0 ? 0 : brackets[i - 1].limit;

      if (income <= current.limit) {
        return current.base + (income - previousLimit) * current.rate;
      }
    }

    return 0;
  }
}
