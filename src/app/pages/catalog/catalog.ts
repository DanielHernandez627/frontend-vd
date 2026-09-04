import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { MediaService, MediaContent } from '../../services/media.service';

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
        <h1>🎬 Catálogo Multimedia</h1>
        <p>Explora nuestra colección de series, anime, películas y documentales con transmisión optimizada HTTP 206 y Skip Intro.</p>
      </div>

      <div class="grid">
        <mat-card class="media-card" *ngFor="let item of catalogItems">
          <div class="card-image-container">
            <img *ngIf="item.coverImageUrl" [src]="item.coverImageUrl" [alt]="item.title" class="cover-image" />
            <div *ngIf="!item.coverImageUrl" class="card-image-placeholder">
              <mat-icon class="play-preview">movie</mat-icon>
            </div>
          </div>
          <mat-card-header>
            <mat-card-title>{{ item.title }}</mat-card-title>
            <mat-card-subtitle>
              {{ item.type || 'Serie' }} • {{ item.seasons ? item.seasons.length : 1 }} Temporada(s)
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="description">{{ item.description }}</p>
            <mat-chip-set class="genre-chips">
              <mat-chip class="white-chip" *ngFor="let category of getCategories(item)">
                {{ category }}
              </mat-chip>
            </mat-chip-set>
          </mat-card-content>
          <mat-card-actions>
            <a mat-raised-button color="primary" [routerLink]="['/player', item.id]" class="play-btn">
              <mat-icon>play_arrow</mat-icon> Ver Contenido
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
      margin-bottom: 2.5rem;
      h1 { font-size: 2.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #ffffff; }
      p { color: #cbd5e1; font-size: 1.05rem; }
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.75rem;
    }
    .media-card {
      background: #1e293b;
      color: #f8fafc;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
      transition: transform 0.25s ease, box-shadow 0.25s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.5);
      }
    }
    .card-image-container {
      height: 220px;
      width: 100%;
      overflow: hidden;
      position: relative;
      background: #0f172a;

      .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.04);
        }
      }

      .card-image-placeholder {
        height: 100%;
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        .play-preview { font-size: 64px; width: 64px; height: 64px; color: #38bdf8; opacity: 0.8; }
      }
    }
    mat-card-header {
      padding: 1.25rem 1.25rem 0.5rem 1.25rem;
    }
    mat-card-title {
      color: #ffffff !important;
      font-size: 1.35rem;
      font-weight: 600;
      line-height: 1.3;
    }
    mat-card-subtitle {
      color: #38bdf8 !important;
      font-weight: 500;
      margin-top: 0.35rem;
    }
    mat-card-content {
      padding: 0 1.25rem;
      margin-top: 0.5rem;
      .description {
        color: #cbd5e1;
        font-size: 0.95rem;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
    mat-chip-set {
      margin-top: 0.75rem;
    }
    .white-chip {
      background: rgba(255, 255, 255, 0.12) !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.25) !important;
      font-weight: 500 !important;
      font-size: 0.85rem;
    }
    mat-card-actions {
      padding: 1.25rem;
    }
    .play-btn {
      width: 100%;
      background-color: #3b82f6 !important;
      color: #ffffff !important;
      font-weight: 600;
      padding: 0.6rem 0;
      border-radius: 8px;
    }
  `]
})
export class CatalogComponent implements OnInit {
  catalogItems: any[] = [];

  demoFallback = [
    {
      id: 1,
      title: 'Band of Brothers (Hermanos de Sangre)',
      type: 'LIVE_ACTION_SERIES',
      coverImageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80',
      description: 'Miniserie de bélica sobre la Easy Company en la Segunda Guerra Mundial.',
      categories: ['Drama', 'Bélico', 'Historia']
    },
    {
      id: 2,
      title: 'Naruto Shippuden (Temporada 1)',
      type: 'ANIME_SERIES',
      coverImageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      description: 'Anime shonen con soporte de reproducción local y botón flotante de Skip Intro.',
      categories: ['Shonen', 'Acción', 'Ninja']
    },
    {
      id: 3,
      title: 'Demon Slayer: Kimetsu no Yaiba',
      type: 'ANIME_SERIES',
      coverImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      description: 'Tanjiro busca curar a su hermana Nezuko mientras enfrenta poderosos demonios.',
      categories: ['Acción', 'Fantasía']
    }
  ];

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.mediaService.getCatalog().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.catalogItems = data;
        } else {
          this.catalogItems = this.demoFallback;
        }
      },
      error: () => {
        // En caso de que el backend no esté encendido aún, usar demoFallback de muestra visual
        this.catalogItems = this.demoFallback;
      }
    });
  }

  getCategories(item: any): string[] {
    if (item.categories) return item.categories;
    if (item.type === 'ANIME_SERIES') return ['Anime', 'Acción'];
    if (item.type === 'LIVE_ACTION_SERIES') return ['Serie', 'Drama'];
    if (item.type === 'MOVIE') return ['Película'];
    return ['General'];
  }
}
