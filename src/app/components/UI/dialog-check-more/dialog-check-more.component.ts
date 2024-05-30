import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogsService } from '../../../services/dialogs/dialogs.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Result } from '../../../models/Result.interface';

@Component({
  selector: 'app-dialog-check-more',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './dialog-check-more.component.html',
  styleUrl: './dialog-check-more.component.scss'
})
export class DialogCheckMoreComponent {

  constructor(private dialogService: DialogsService, @Inject(MAT_DIALOG_DATA) public data: Result){}

  public colorType: string = 'flegmatic';


  ngOnInit(): void {
    this.detectTypeColor(this.data.type);
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
  closeModal(): void {
    this.dialogService.closeDialog();
  }
}
