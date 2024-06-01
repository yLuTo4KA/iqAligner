import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { DatePipe } from '@angular/common';

import { Result } from '../../../../models/Result.interface';
import { MatFabButton } from '@angular/material/button';
import { DialogsService } from '../../../../services/dialogs/dialogs.service';


@Component({
  selector: 'app-bot-message',
  standalone: true,
  imports: [DatePipe, MatFabButton],
  templateUrl: './bot-message.component.html',
  styleUrl: './bot-message.component.scss'
})
export class BotMessageComponent implements OnInit, OnChanges{
  
  constructor(private dialogService: DialogsService) {}
  printedText: string = '';
  public colorType: string = 'flegmatic';
  public date: number = Date.now();
  public viewBtnReview: boolean = false;

  @Input() text?: string;
  @Input() answer?: Result;

  ngOnInit(): void {
      this.processInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['text'] || changes['answer']) {
      this.processInputs();
    }
  }

  private processInputs(): void {
    if(this.text && this.text.trim().length > 2) {
      this.typeText(this.text);
    }
    if(this.answer) {
      console.log("Answer!")
      this.detectTypeColor(this.answer.type);
      this.typeText(this.answer.analysis);
    }
  }

  typeText(text: string): void {
    let ndx = 0;
    if(text) {
      const interval = setInterval(() => {
        if(ndx < text.length) {
          this.printedText += text.charAt(ndx);
          ndx++;
        }else {
          this.viewBtnReview = true;
          clearInterval(interval);
        }
      }, 50);
    }
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

  openReviewDialog(): void {
    this.dialogService.openReviewDialog();
  }
}
