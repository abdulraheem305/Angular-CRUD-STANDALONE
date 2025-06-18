import { Component, OnInit } from '@angular/core';
import { CompanyService } from './company.service';
import { ICompany } from '../interfaces/company.interfaces';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-company-list',
    imports: [CommonModule],
    templateUrl: './company-list.component.html',
    styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
    companies$!: Observable<ICompany[]>;

    constructor(private companyService: CompanyService) { }

    public ngOnInit(): void {
        this.companies$ = this.companyService.getCompanies();
    }
}
