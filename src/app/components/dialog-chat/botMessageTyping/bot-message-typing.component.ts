import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bot-message-typing',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './bot-message-typing.component.html',
  styleUrl: './bot-message-typing.component.scss'
})
export class BotMessageTypingComponent {
  public date: number = Date.now();
  printedText: string = '';
  stop: boolean = false;

  ngOnInit(): void {
    this.printText();
  }

  printText(): void {
    let dotCount = 0;
    const interval = setInterval(() => {
      if(dotCount < 3) {
        this.printedText += '.';
        dotCount++;
      }else {
        this.printedText = '';
        dotCount = 0;
      }
      if(this.stop) {
        clearInterval(interval);
      }
    }, 200)
  }

  ngOnDestroy(): void {
    this.stop = true;
  }

}
