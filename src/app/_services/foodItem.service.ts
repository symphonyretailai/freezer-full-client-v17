import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import{ FoodItem } from '../_models'
import { ITag } from '@app/_models/ITag';
import { Observable } from 'rxjs';

//const baseUrl = 'https://freezer-full.azurewebsites.net/FoodItems';
const baseUrl = 'https://localhost:52352/FoodItems';

@Injectable({ providedIn: 'root' })
export class FoodItemService {
    constructor(private http: HttpClient) { }

    public tagList():Observable<ITag[]>{
        return this.http.get<ITag[]>(`${baseUrl}/getAllTags`);
    }

    getAll() {
        return this.http.get<FoodItem[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<FoodItem>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`);
    }

    getAllTags() {
        return this.http.get<ITag[]>(`${baseUrl}/getAllTags`);
    }
}