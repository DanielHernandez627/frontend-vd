import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink
  ],
  template: `
    <div class="player-container">
      <div class="top-nav">
        <a mat-button color="accent" routerLink="/catalog">
          <mat-icon>arrow_back</mat-icon> Volver al Catálogo
        </a>
        <h2>Reproduciendo Serie ID: {{ id }}</h2>
      </div>

      <mat-card class="video-wrapper">
        <div class="video-placeholder">
          <mat-icon class="video-icon">ondemand_video</mat-icon>
          <p>Reproductor HTML5 con Streaming HTTP 206 (Backend Spring Boot)</p>
          <button mat-flat-button color="warn" class="skip-btn">
            <mat-icon>fast_forward</mat-icon> Saltar Intro (01:30 - 03:00)
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .player-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    .top-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      h2 { margin: 0; font-size: 1.5rem; color: #f8fafc; }
    }
    .video-wrapper {
      background: #000;
      border-radius: 12px;
      overflow: hidden;
    }
    .video-placeholder {
      height: 480px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      position: relative;
      background: radial-gradient(circle, #1e293b 0%, #090d16 100%);
      .video-icon { font-size: 80px; width: 80px; height: 80px; color: #38bdf8; margin-bottom: 1rem; }
    }
    .skip-btn {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
    }
  `]
})
export class PlayerComponent implements OnInit {
  @Input() id!: string;

  ngOnInit() {
    console.log('PlayerComponent cargado diferidamente para ID:', this.id);
  }
}
