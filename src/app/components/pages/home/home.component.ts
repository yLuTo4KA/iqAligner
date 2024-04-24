import { Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFabButton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
