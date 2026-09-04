import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface DialogData {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  details?: string[];
  importedFileNames?: string[];
  skippedFileNames?: string[];
  buttonText?: string;
}

@Component({
  selector: 'app-custom-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './custom-dialog.html',
  styleUrl: './custom-dialog.scss'
})
export class CustomDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  get iconName(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  get headerClass(): string {
    return `dialog-header type-${this.data.type || 'info'}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}
