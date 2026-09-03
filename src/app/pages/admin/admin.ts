import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="admin-container">
      <mat-card class="admin-card">
        <mat-card-header>
          <mat-card-title>⚙️ Panel de Administración - Carga de Anime</mat-card-title>
          <mat-card-subtitle>Gestión de metadatos y asignación de marcas para Skip Intro</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form class="admin-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Título de la Serie</mat-label>
              <input matInput placeholder="Ej. Shingeki no Kyojin" />
            </mat-form-field>

            <div class="row">
              <mat-form-field appearance="outline">
                <mat-label>Inicio Intro (segundos)</mat-label>
                <input matInput type="number" placeholder="Ej. 90" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Fin Intro (segundos)</mat-label>
                <input matInput type="number" placeholder="Ej. 180" />
              </mat-form-field>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-raised-button color="primary">
            <mat-icon>save</mat-icon> Guardar Serie
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .admin-card {
      background: #1e293b;
      color: #f8fafc;
      border-radius: 12px;
      padding: 1rem;
    }
    mat-card-title { color: #f8fafc !important; }
    mat-card-subtitle { color: #94a3b8 !important; }
    .admin-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .full-width { width: 100%; }
    .row { display: flex; gap: 1rem; mat-form-field { flex: 1; } }
  `]
})
export class AdminComponent {}
