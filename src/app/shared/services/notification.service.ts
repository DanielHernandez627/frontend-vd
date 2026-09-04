import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent, DialogData } from '../components/custom-dialog/custom-dialog';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private dialog: MatDialog) {}

  showSuccess(title: string, message: string, importedFiles?: string[], skippedFiles?: string[]): void {
    const data: DialogData = {
      type: 'success',
      title,
      message,
      importedFileNames: importedFiles,
      skippedFileNames: skippedFiles,
      buttonText: 'Entendido'
    };
    this.dialog.open(CustomDialogComponent, {
      data,
      panelClass: 'custom-dialog-panel',
      width: '460px'
    });
  }

  showError(title: string, message: string): void {
    const data: DialogData = {
      type: 'error',
      title,
      message,
      buttonText: 'Cerrar'
    };
    this.dialog.open(CustomDialogComponent, {
      data,
      panelClass: 'custom-dialog-panel',
      width: '460px'
    });
  }

  showWarning(title: string, message: string): void {
    const data: DialogData = {
      type: 'warning',
      title,
      message,
      buttonText: 'Aceptar'
    };
    this.dialog.open(CustomDialogComponent, {
      data,
      panelClass: 'custom-dialog-panel',
      width: '460px'
    });
  }

  showInfo(title: string, message: string): void {
    const data: DialogData = {
      type: 'info',
      title,
      message,
      buttonText: 'Entendido'
    };
    this.dialog.open(CustomDialogComponent, {
      data,
      panelClass: 'custom-dialog-panel',
      width: '460px'
    });
  }
}
