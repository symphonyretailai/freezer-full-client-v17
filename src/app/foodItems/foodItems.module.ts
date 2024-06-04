import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FoodItemssRoutingModule } from './foodItems-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { FilterPipe } from "../_pipes/filter.pipe";
import { SortDirective } from '@app/_directives/sort.directive';
import { TagComponent } from "./tag/tag.component";
import { FilterByTagPipe } from "../_pipes/filter-by-tag.pipe";
import { AddEditTagComponent } from "./add-edit-tag/add-edit-tag.component";

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
        FilterByTagPipe,
        AddEditTagComponent
    ]
})
export class FoodItemsModule { }