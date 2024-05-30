import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { DialogsService } from '../../../services/dialogs/dialogs.service';
import { ReviewsService } from '../../../services/reviews/reviews.service';



@Component({
  selector: 'app-dialog-add-review',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, MatInputModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './dialog-add-review.component.html',
  styleUrl: './dialog-add-review.component.scss'
})
export class DialogAddReviewComponent implements OnInit, OnDestroy{
  private subscriptions = new Subscription();
  public loading: boolean = false;
  public reviewText: string = '';
  public grade: number = 5;
  public error: string | null = null;

  constructor(private dialogService: DialogsService, private reviewService: ReviewsService){}

  ngOnInit(): void {
      this.subscriptions.add(
        this.reviewService.loading$.subscribe(loading => this.loading = loading)
      )
  }


  handleSendReview(): void {
    this.subscriptions.add(
      this.reviewService.sendReview(this.reviewText, this.grade).subscribe({
        next: data => {
          this.dialogService.closeDialog();
        },
        error: error => {
          this.error = error;
          console.log(error);
        }
      })
    )
  }
  setRating(rating: number) {
    this.grade = rating;
  }

  handleGenerateReview(): void {
    this.subscriptions.add(
      this.reviewService.generateReview(this.grade).subscribe(response => {
        this.reviewText = response.review
      })
    );
  }


  closeModal(): void {
    this.dialogService.closeDialog();
  }
  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }
}
