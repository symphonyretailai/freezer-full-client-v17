import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';

const foodItemsModule = () => import('./foodItems/foodItems.module').then(x => x.FoodItemssModule);

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'foodItems', loadChildren: foodItemsModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }