import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    templateUrl: 'home.component.html',
    standalone: true,
    imports: [RouterLink]
})
export class HomeComponent { }