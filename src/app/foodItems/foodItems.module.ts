import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FoodItemssRoutingModule } from './foodItems-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../_pipes/filter.pipe";
import { SortDirective } from '@app/_directives/sort.directive';
import { TagComponent } from "./tag/tag.component";
import { FilterByTagPipe } from "../_pipes/filter-by-tag.pipe";

@NgModule({
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        SortDirective
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FoodItemssRoutingModule,
        FormsModule,
        FilterPipe,
        TagComponent,
        FilterByTagPipe
    ]
})
export class FoodItemsModule { }