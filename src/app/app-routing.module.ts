import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AddEditComponent } from './foodItems/add-edit.component';

const foodItemsModule = () => import('./foodItems/foodItems.module').then(x => x.FoodItemsModule);

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'foodItems', loadChildren: foodItemsModule },
    { path: 'edit/:foodItemId', component: AddEditComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }