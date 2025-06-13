import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    public signupForm!: FormGroup;
    public errorMessage: string = '';
    public successMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    public ngOnInit(): void {
        this.signupForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    public onSubmit(): void {
        if (this.signupForm.invalid) return;

        const newUser = {
            id: uuidv4(),
            name: this.signupForm.value.name,
            email: this.signupForm.value.email,
            password: this.signupForm.value.password
        };

        this.authService.signup(newUser).subscribe({
            next: () => {
                this.successMessage = 'Signup successful! Redirecting...';
                setTimeout(() => this.router.navigate(['/login']), 1500);
            },
            error: (err: any) => {
                this.errorMessage = err?.message || 'Signup failed. Please try again.';
            }
        });
    }
}
