import { Component, Input, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';

import { Answer } from '../../../models/Answers.interface';
import { Result } from '../../../models/Result.interface';


@Component({
  selector: 'app-bot-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './bot-message.component.html',
  styleUrl: './bot-message.component.scss'
})
export class BotMessageComponent implements OnInit{
  printedText: string = '';
  public date: number = Date.now();

  @Input() text!: string;
  @Input() answer: Result | null = null;

  ngOnInit(): void {
    if(this.text) {
      this.typeText(this.text);
    }
  }

  typeText(text: string): void {
    let ndx = 0;
    const interval = setInterval(() => {
      if(ndx < text.length) {
        this.printedText += text.charAt(ndx);
        ndx++;
      }else {
        clearInterval(interval);
      }
    }, 50);
  }
}
