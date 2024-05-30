import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { MatFabButton } from '@angular/material/button';

import { DialogsService } from '../../../services/dialogs/dialogs.service';
import { Review } from '../../../models/Review.interface';
import { Subscription } from 'rxjs';
import { ReviewsService } from '../../../services/reviews/reviews.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ReviewCardComponent } from '../../UI/review-card/review-card.component';

import { countReviews } from '../../../models/Review.interface';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFabButton, MatProgressSpinnerModule, ReviewCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit, OnDestroy{
  private subscriptions = new Subscription();
  public reviews: Review[] | null = null;
  public countReviews: countReviews = {count: 0};
  public loading: boolean = false;
  public swiperBreakpoints = {
    1000: {
      slidesPerView: 2,
      spaceBetween: 30
    },
    0: {
      slidesPerView: 1,
      spaceBetween: 20
    }
  };

  constructor(private dialogsService: DialogsService, private reviewsService: ReviewsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.reviewsService.reviews$.subscribe(reviews => this.reviews = reviews)
    );
    this.subscriptions.add(
      this.reviewsService.loading$.subscribe(loading => this.loading = loading)
    );
    this.subscriptions.add(
      this.reviewsService.countReviews$.subscribe(countReviews => this.countReviews = countReviews)
    )
    if(!this.reviews) {
      this.subscriptions.add(
        this.reviewsService.getReviews().subscribe()
      )
    }
    if(this.countReviews.count === 0) {
      this.subscriptions.add(
        this.reviewsService.getCountReviews().subscribe()
      )
    }
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          this.router.navigate([], { fragment: undefined, replaceUrl: true });
        }
      }
    });
  }

  handleOpenChat(): void {
    this.dialogsService.openChatDialog();
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }
  
}
