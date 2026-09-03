import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterLink
  ],
  template: `
    <div class="catalog-container">
      <div class="header">
        <h1>🍿 Catálogo de Animes</h1>
        <p>Selecciona un anime para comenzar la reproducción con transmisión optimizada HTTP 206 y Skip Intro.</p>
      </div>

      <div class="grid">
        <mat-card class="anime-card" *ngFor="let item of catalogItems">
          <div class="card-image-placeholder">
            <mat-icon class="play-preview">play_circle_outline</mat-icon>
          </div>
          <mat-card-header>
            <mat-card-title>{{ item.title }}</mat-card-title>
            <mat-card-subtitle>{{ item.episodes }} Episodios • {{ item.season }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ item.description }}</p>
            <mat-chip-set>
              <mat-chip *ngFor="let genre of item.genres" color="accent">{{ genre }}</mat-chip>
            </mat-chip-set>
          </mat-card-content>
          <mat-card-actions>
            <a mat-raised-button color="primary" [routerLink]="['/player', item.id]">
              <mat-icon>play_arrow</mat-icon> Ver Serie
            </a>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .catalog-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 2rem;
      h1 { font-size: 2rem; font-weight: 500; margin-bottom: 0.5rem; }
      p { color: #94a3b8; }
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .anime-card {
      background: #1e293b;
      color: #f8fafc;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-image-placeholder {
      height: 180px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      .play-preview { font-size: 64px; width: 64px; height: 64px; opacity: 0.8; }
    }
    mat-card-title { color: #f8fafc !important; }
    mat-card-subtitle { color: #cbd5e1 !important; }
    mat-card-content { margin-top: 1rem; color: #94a3b8; }
    mat-chip-set { margin-top: 0.5rem; }
    mat-card-actions { padding: 1rem; }
  `]
})
export class CatalogComponent {
  catalogItems = [
    {
      id: 'demo-anime-1',
      title: 'Demon Slayer: Kimetsu no Yaiba',
      season: 'Temporada 1',
      episodes: 26,
      description: 'Estructura de prueba para streaming local con soporte de saltar intro automático.',
      genres: ['Acción', 'Fantasía']
    },
    {
      id: 'demo-anime-2',
      title: 'Jujutsu Kaisen',
      season: 'Temporada 2',
      episodes: 23,
      description: 'Demostración de componente con carga diferida (Lazy Loaded Component).',
      genres: ['Shonen', 'Sobrenatural']
    }
  ];
}
