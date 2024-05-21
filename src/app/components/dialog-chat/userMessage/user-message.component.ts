import { Component, Input } from '@angular/core';
import { User } from '../../../models/User.interface';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.scss'
})
export class UserMessageComponent {
  public date: number = Date.now();
  @Input() text!: string;
  @Input() userData: User | null = null;
}
