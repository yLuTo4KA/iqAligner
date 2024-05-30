import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/User.interface';
import { Answer } from '../../../models/Answers.interface';
import { MatFabButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { ResultCardComponent } from '../../UI/result-card/result-card.component';
import { Subscription } from 'rxjs';
import { DialogsService } from '../../../services/dialogs/dialogs.service';

import { DiplomeComponent } from '../../UI/diplome/diplome.component';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatFabButton, ResultCardComponent, MatProgressSpinner],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('diplomeContainer', {read: ViewContainerRef}) diplomeContainer!: ViewContainerRef;

  private subscriptions = new Subscription();
  token: string | null = null;
  userData: User | null = null;
  change: boolean = true;
  answers: Answer[] | null = null;
  loading: boolean = false;
  constructor(private userService: UserService, private dialogService: DialogsService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.subscriptions.add(this.userService.getUserObservable().subscribe({
      next: userData => this.userData = userData,
      error: error => console.log(error),
    }));
    this.subscriptions.add(
      this.userService.answers$.subscribe(answers => this.answers = answers)
    );
    this.subscriptions.add(
      this.userService.loading$.subscribe(loading => this.loading = loading)
    );
    this.subscriptions.add(
      this.userService.getAllAnswer().subscribe()
    );

    if (!this.userData) {
      this.userService.getUser();
    }
  }

  handleOpenChangeAvatar(): void {
    this.dialogService.openAvatarChangeDialog();
  }
  handleOpenChangeUserInfo(): void {
    this.dialogService.openUserInfoChangeDialog();
  }

  async handleDownloadDiplome(diplomeData: Answer, userData: User): Promise<void> {
    const diplomeFactory = this.diplomeContainer.createComponent(DiplomeComponent);
    diplomeFactory.instance.diplomeData = diplomeData;
    diplomeFactory.instance.userData = userData;
    
   await new Promise(resolve => setTimeout(resolve, 1000));
    const diplomeElement = diplomeFactory.location.nativeElement;

    html2canvas(diplomeElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('diplome.pdf');

      // Удалите компонент после создания PDF
      this.diplomeContainer.clear();
    });
    
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
