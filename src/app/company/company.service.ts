import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompany } from '../interfaces/company.interfaces';
import { environment } from '../../enviornments/enviornment';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private readonly apiUrl: string = environment.companyUrl;

    constructor(private http: HttpClient) { }

    getCompanies(): Observable<ICompany[]> {
        return this.http.get<ICompany[]>(this.apiUrl);
    }
}
