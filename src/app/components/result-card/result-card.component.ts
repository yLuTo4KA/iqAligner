import { Component, Input, OnInit } from '@angular/core';
import { Result } from '../../models/Result.interface';

import { MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [MatFabButton, MatIconModule],
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss'
})
export class ResultCardComponent implements OnInit {
  @Input ({required: true}) answerId!: string;
  @Input({required: true}) aiAnswer!: Result;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.detectTypeColor(this.aiAnswer.type);
  }

  
  public showAll: boolean = false;
  public colorType: string = 'flegmatic';
  
  get displayedProfession() {
    return this.showAll ? this.aiAnswer.profession : this.aiAnswer.profession.slice(0, 5);
  }

  public changeShow(): void {
    this.showAll = !this.showAll;
  }
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

  handleRemoveAnswer(answerId: string): void {
    this.userService.removeAnswer(answerId).subscribe({
      next: data => {
      },
      error: error => {
        console.error(error);
      }
    });
  }
}
