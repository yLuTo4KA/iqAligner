import { Component, Input } from '@angular/core';
import { Review } from '../../../models/Review.interface';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [MatIconModule, DatePipe],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss'
})
export class ReviewCardComponent {
  @Input({required: true}) reviewData!: Review;

  getNumberArray(n: number): number[] {
    return Array(n).fill(0).map((_, i) => i);
  }
}
