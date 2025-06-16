import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    ReactiveFormsModule,
    AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IGradeOption } from '../interfaces/cgpaCalculatpr.interfaces';


@Component({
    selector: 'app-cgpa-calculator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cgpa-calculator.component.html',
    styleUrls: ['./cgpa-calculator.component.css']
})
export class CgpaCalculatorComponent {
    public cgpaForm: FormGroup;
    public cgpa: number | null = null;

    public readonly gradeOptions: IGradeOption[] = [
        { label: 'A', value: 4.0 },
        { label: 'A-', value: 3.67 },
        { label: 'B+', value: 3.33 },
        { label: 'B', value: 3.0 },
        { label: 'B-', value: 2.67 },
        { label: 'C+', value: 2.33 },
        { label: 'C', value: 2.0 },
        { label: 'C-', value: 1.67 },
        { label: 'D+', value: 1.33 },
        { label: 'D', value: 1.0 },
        { label: 'F', value: 0.0 }
    ];

    public readonly creditOptions: number[] = [1, 2, 3, 4];

    constructor(private readonly fb: FormBuilder) {
        this.cgpaForm = this.fb.group({
            currentCgpa: [null],
            completedCredits: [null],
            subjects: this.fb.array(
                Array.from({ length: 7 }, () => this.createSubjectGroup())
            )
        });
    }


    public get subjects(): FormArray {
        return this.cgpaForm.get('subjects') as FormArray;
    }


    public get subjectIndices(): number[] {
        return this.subjects.controls.map((_, i) => i);
    }


    public getSubjectGroup(index: number): FormGroup {
        return this.subjects.at(index) as FormGroup;
    }


    private createSubjectGroup(): FormGroup {
        return this.fb.group({
            gradePoint: [null],
            creditHours: [null]
        });
    }


    public calculateCGPA(): void {
        const currentCgpa: number = +this.cgpaForm.get('currentCgpa')?.value || 0;
        const completedCredits: number = +this.cgpaForm.get('completedCredits')?.value || 0;

        let newPoints = 0;
        let newCredits = 0;

        this.subjects.controls.forEach((subject: AbstractControl) => {
            const gp = +subject.get('gradePoint')?.value;
            const ch = +subject.get('creditHours')?.value;

            if (!isNaN(gp) && !isNaN(ch)) {
                newPoints += gp * ch;
                newCredits += ch;
            }
        });

        const totalPoints: number = currentCgpa * completedCredits + newPoints;
        const totalCredits: number = completedCredits + newCredits;

        this.cgpa = totalCredits > 0 ? totalPoints / totalCredits : null;
    }
    

    public clearRow(index: number): void {
    this.subjects.at(index).reset();
}


    public resetForm(): void {
    this.cgpaForm.reset();
    this.cgpa = null;
}
}
