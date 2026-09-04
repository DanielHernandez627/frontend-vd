import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { timeStringToSeconds } from '../../utils/time-converter';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="admin-container">
      <mat-card class="admin-card">
        <mat-card-header>
          <mat-card-title>⚙️ Panel de Administración - Carga de Contenido y Video</mat-card-title>
          <mat-card-subtitle>Gestión de metadatos, carátulas, ruta de archivos .mp4 locales y marcas de tiempo</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form class="admin-form" (ngSubmit)="onSubmit()">
            
            <h3 class="section-title">🎬 1. Información General del Contenido</h3>
            
            <!-- Título y Tipo -->
            <div class="row">
              <mat-form-field appearance="outline" class="flex-2">
                <mat-label>Título del Contenido</mat-label>
                <input matInput [(ngModel)]="formData.title" name="title" placeholder="Ej. Naruto Shippuden / Band of Brothers" required />
              </mat-form-field>

              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Tipo de Contenido</mat-label>
                <mat-select [(ngModel)]="formData.type" name="type">
                  <mat-option value="ANIME_SERIES">Anime</mat-option>
                  <mat-option value="LIVE_ACTION_SERIES">Serie Live Action</mat-option>
                  <mat-option value="MOVIE">Película</mat-option>
                  <mat-option value="DOCUMENTARY">Documental</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- URL de la Carátula (Poster/Miniatura) -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>URL o Ruta de la Carátula (Poster / Miniatura)</mat-label>
              <input matInput [(ngModel)]="formData.coverImageUrl" name="coverImageUrl" placeholder="Ej. https://.../naruto_s1.jpg o /assets/images/band_of_brothers.jpg" />
            </mat-form-field>

            <!-- Descripción -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput [(ngModel)]="formData.description" name="description" rows="2" placeholder="Sinopsis o descripción del contenido..."></textarea>
            </mat-form-field>

            <h3 class="section-title">📽 2. Configuración de Episodio y Archivo de Video (.mp4)</h3>

            <div class="row">
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Temporada N°</mat-label>
                <input matInput type="number" [(ngModel)]="formData.seasonNumber" name="seasonNumber" min="1" required />
              </mat-form-field>

              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Episodio N°</mat-label>
                <input matInput type="number" [(ngModel)]="formData.episodeNumber" name="episodeNumber" min="1" required />
              </mat-form-field>

              <mat-form-field appearance="outline" class="flex-2">
                <mat-label>Título del Episodio</mat-label>
                <input matInput [(ngModel)]="formData.episodeTitle" name="episodeTitle" placeholder="Ej. Capítulo 1: El Comienzo" required />
              </mat-form-field>
            </div>

            <!-- Ruta Local del Archivo de Video -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Ruta del Archivo de Video Local (.mp4)</mat-label>
              <input matInput [(ngModel)]="formData.videoPath" name="videoPath" placeholder="Ej. /videos/anime/naruto_s1_e01.mp4 o C:/media/band_of_brothers_e01.mp4" required />
              <mat-hint>Ruta física donde se almacena el archivo .mp4 en el disco para streaming HTTP 206.</mat-hint>
            </mat-form-field>

            <h3 class="section-title">⏱ 3. Configuración de Skip Intro (Formato MM:SS)</h3>
            <p class="section-desc">Ingresa el tiempo en minutos:segundos (ej. <b>0:38</b> al <b>2:11</b>). El sistema lo convierte automáticamente a segundos.</p>

            <div class="row">
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Inicio Intro (Minuto:Segundo)</mat-label>
                <input matInput [(ngModel)]="formData.introStart" name="introStart" placeholder="Ej. 0:38 o 1:30" (input)="updateCalculatedSeconds()" />
                <mat-hint *ngIf="calculatedStartSeconds > 0">Equivale a: {{ calculatedStartSeconds }} segundos</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Fin Intro (Minuto:Segundo)</mat-label>
                <input matInput [(ngModel)]="formData.introEnd" name="introEnd" placeholder="Ej. 2:11 o 3:00" (input)="updateCalculatedSeconds()" />
                <mat-hint *ngIf="calculatedEndSeconds > 0">Equivale a: {{ calculatedEndSeconds }} segundos</mat-hint>
              </mat-form-field>
            </div>

            <div class="submit-row">
              <button mat-raised-button color="primary" type="submit" class="save-btn">
                <mat-icon>save</mat-icon> Guardar Contenido y Video
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2.5rem 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .admin-card {
      background: #1e293b !important;
      color: #ffffff !important;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    }
    mat-card-title {
      color: #ffffff !important;
      font-size: 1.6rem;
      font-weight: 600;
    }
    mat-card-subtitle {
      color: #38bdf8 !important;
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }
    .admin-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-top: 1.5rem;
    }
    .full-width { width: 100%; }
    .row {
      display: flex;
      gap: 1.25rem;
      @media (max-width: 640px) {
        flex-direction: column;
        gap: 1rem;
      }
    }
    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }

    .section-title {
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: 600;
      margin: 1.5rem 0 0.25rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.5rem;
    }
    .section-desc {
      color: #cbd5e1;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
      b { color: #38bdf8; }
    }

    /* Sobrescritura Limpia usando Variables Nativas MDC */
    ::ng-deep .admin-card {
      .mat-mdc-form-field {
        --mdc-outlined-text-field-outline-color: rgba(255, 255, 255, 0.25);
        --mdc-outlined-text-field-hover-outline-color: #38bdf8;
        --mdc-outlined-text-field-focus-outline-color: #38bdf8;
        --mdc-outlined-text-field-label-text-color: #cbd5e1;
        --mdc-outlined-text-field-hover-label-text-color: #38bdf8;
        --mdc-outlined-text-field-focus-label-text-color: #38bdf8;
        --mdc-outlined-text-field-input-text-color: #ffffff;

        .mat-mdc-floating-label {
          color: #cbd5e1 !important;
        }
        input.mat-mdc-input-element, textarea.mat-mdc-input-element {
          color: #ffffff !important;
        }
        input::placeholder, textarea::placeholder {
          color: rgba(255, 255, 255, 0.45) !important;
        }
        .mat-mdc-select-value-text {
          color: #ffffff !important;
        }
        .mat-mdc-form-field-hint {
          color: #38bdf8 !important;
          font-weight: 500;
        }
      }
    }

    .submit-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }
    .save-btn {
      background-color: #3b82f6 !important;
      color: #ffffff !important;
      font-weight: 600;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
    }
  `]
})
export class AdminComponent {
  formData = {
    title: '',
    type: 'ANIME_SERIES',
    coverImageUrl: '',
    description: '',
    seasonNumber: 1,
    episodeNumber: 1,
    episodeTitle: '',
    videoPath: '',
    introStart: '0:38',
    introEnd: '2:11'
  };

  calculatedStartSeconds: number = 38;
  calculatedEndSeconds: number = 131;

  updateCalculatedSeconds() {
    this.calculatedStartSeconds = timeStringToSeconds(this.formData.introStart);
    this.calculatedEndSeconds = timeStringToSeconds(this.formData.introEnd);
  }

  onSubmit() {
    this.updateCalculatedSeconds();
    console.log('Formulario enviado:', {
      ...this.formData,
      introStartSeconds: this.calculatedStartSeconds,
      introEndSeconds: this.calculatedEndSeconds
    });
    alert(`Contenido "${this.formData.title}" y Episodio "${this.formData.episodeTitle}" (Video: ${this.formData.videoPath}) guardados con Skip Intro de ${this.calculatedStartSeconds}s a ${this.calculatedEndSeconds}s!`);
  }
}
