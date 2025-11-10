import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-front-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './front-layout.component.html',
  styleUrl: './front-layout.component.css'
})
export class FrontLayoutComponent {

}
