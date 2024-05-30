import { Component, Input } from '@angular/core';
import { User } from '../../../models/User.interface';
import { Answer } from '../../../models/Answers.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-diplome',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './diplome.component.html',
  styleUrl: './diplome.component.scss'
})
export class DiplomeComponent {
  @Input({required: true}) diplomeData!: Answer;
  @Input({required: true}) userData!: User;

  ngOnInit(): void {
    this.detectTypeColor(this.diplomeData.aiAnswer.type);
  }

  public colorType: string = 'flegmatic';

  detectTypeColor(type: string): void {
    switch (type.toLowerCase()) {
      case 'флегматик': 
        this.colorType = 'flegmatic';
        break;
      case 'меланхолик':
        this.colorType = 'melancholic';
        break;
      case 'сангвиник':
        this.colorType = 'sangvinnik';
        break;
      case 'холерик':
        this.colorType = 'holerik';
        break;
      default: 
        this.colorType = 'flegmatic';
    }
  }
}
