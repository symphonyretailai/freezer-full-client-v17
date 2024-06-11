import { Component } from '@angular/core';
import { AlertComponent } from './_components/alert.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root', templateUrl: 'app.component.html',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, AlertComponent, RouterOutlet]
})
export class AppComponent { }