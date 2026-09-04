import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})
export class CatalogComponent implements OnInit {
  catalogItems: MediaContent[] = [];

  constructor(
    private mediaService: MediaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.mediaService.getCatalog().subscribe({
      next: (data) => {
        this.catalogItems = data || [];
        this.catalogItems.forEach(item => {
          if (item.seasons) {
            item.seasons.sort((a, b) => (a.seasonNumber || 0) - (b.seasonNumber || 0));
            item.seasons.forEach(season => {
              if (season.episodes) {
                season.episodes.sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
              }
            });
          }
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar catálogo:', err);
        this.catalogItems = [];
        this.cdr.detectChanges();
      }
    });
  }

  getCategories(item: MediaContent): string[] {
    if (item.type === 'ANIME_SERIES') return ['Anime', 'Acción'];
    if (item.type === 'LIVE_ACTION_SERIES') return ['Serie', 'Drama'];
    if (item.type === 'MOVIE') return ['Película'];
    if (item.type === 'DOCUMENTARY') return ['Documental'];
    return ['General'];
  }

  getTotalEpisodesCount(item: MediaContent): number {
    if (!item.seasons) return 0;
    return item.seasons.reduce((acc, season) => acc + (season.episodes ? season.episodes.length : 0), 0);
  }
}
