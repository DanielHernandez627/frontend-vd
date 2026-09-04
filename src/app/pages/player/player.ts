import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MediaService, SkipTimestamp } from '../../services/media.service';

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
        <a mat-stroked-button class="back-btn" routerLink="/catalog">
          <mat-icon>arrow_back</mat-icon> Volver al Catálogo
        </a>
        <h2 class="content-title">Reproduciendo Contenido ID: {{ id }}</h2>
      </div>

      <mat-card class="video-card">
        <div class="video-wrapper">
          <!-- Reproductor de Video HTML5 con Streaming HTTP 206 -->
          <video
            #videoPlayer
            class="video-element"
            [src]="videoStreamUrl"
            (timeupdate)="onTimeUpdate($event)"
            controls
            preload="metadata">
          </video>

          <!-- Fallback Visual si no hay video local disponible -->
          <div *ngIf="showPlaceholder" class="video-placeholder-overlay">
            <mat-icon class="video-icon">ondemand_video</mat-icon>
            <p class="placeholder-text">Transmisión de Video en Vivo • HTTP 206 Partial Content (Spring Boot)</p>
          </div>

          <!-- Botón Flotante de Skip Intro (Glassmorphism Degradado Azul/Violeta) -->
          <button
            *ngIf="currentSkipInterval"
            class="skip-intro-btn"
            (click)="executeSkip()">
            <mat-icon>fast_forward</mat-icon> {{ currentSkipInterval.label || 'Saltar Opening (+90s)' }}
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .player-container {
      padding: 2rem;
      max-width: 1050px;
      margin: 0 auto;
    }
    .top-nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.75rem;

      .back-btn {
        color: #ffffff !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        font-weight: 500;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);

        &:hover {
          background: rgba(255, 255, 255, 0.15) !important;
        }

        mat-icon {
          color: #ffffff !important;
        }
      }

      .content-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #ffffff;
      }
    }
    .video-card {
      background: #000;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .video-wrapper {
      position: relative;
      width: 100%;
      height: 520px;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .video-element {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .video-placeholder-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, #1e293b 0%, #090d16 100%);
      pointer-events: none;

      .video-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        color: #38bdf8;
        margin-bottom: 1rem;
      }
      .placeholder-text {
        color: #cbd5e1;
        font-size: 1.1rem;
        font-weight: 500;
      }
    }
    .skip-intro-btn {
      position: absolute;
      bottom: 3.5rem;
      right: 2.5rem;
      z-index: 10;
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 28px;
      padding: 0.75rem 1.6rem;
      font-size: 0.95rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.5);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      mat-icon {
        color: #ffffff !important;
      }

      &:hover {
        transform: translateY(-3px) scale(1.04);
        box-shadow: 0 8px 25px rgba(124, 58, 237, 0.7);
        background: linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%);
      }

      &:active {
        transform: translateY(0) scale(0.98);
      }
    }
  `]
})
export class PlayerComponent implements OnInit {
  @Input() id!: string;
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;

  videoStreamUrl: string = '';
  showPlaceholder: boolean = true;
  skipIntervals: SkipTimestamp[] = [];
  currentSkipInterval: SkipTimestamp | null = null;

  // Intervalo de demostración stático por defecto si no viene de la API
  demoSkipInterval: SkipTimestamp = {
    id: 1,
    type: 'INTRO',
    startTimeSeconds: 1,
    endTimeSeconds: 90,
    label: 'Saltar Opening (+90s)'
  };

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    if (this.id) {
      this.videoStreamUrl = this.mediaService.getVideoStreamUrl(this.id);
      this.mediaService.getSkipTimestamps(this.id).subscribe({
        next: (timestamps) => {
          if (timestamps && timestamps.length > 0) {
            this.skipIntervals = timestamps;
          } else {
            this.skipIntervals = [this.demoSkipInterval];
          }
          this.currentSkipInterval = this.demoSkipInterval; // Activo para vista previa estática
        },
        error: () => {
          this.skipIntervals = [this.demoSkipInterval];
          this.currentSkipInterval = this.demoSkipInterval;
        }
      });
    } else {
      this.currentSkipInterval = this.demoSkipInterval;
    }
  }

  onTimeUpdate(event: Event) {
    const video = event.target as HTMLVideoElement;
    if (!video) return;

    if (video.currentTime > 0) {
      this.showPlaceholder = false;
    }

    const currentTime = video.currentTime;
    this.currentSkipInterval = this.skipIntervals.find(
      interval => currentTime >= interval.startTimeSeconds && currentTime <= interval.endTimeSeconds
    ) || null;
  }

  executeSkip() {
    if (this.currentSkipInterval && this.videoPlayerRef && this.videoPlayerRef.nativeElement) {
      this.videoPlayerRef.nativeElement.currentTime = this.currentSkipInterval.endTimeSeconds;
      this.currentSkipInterval = null;
    } else {
      // Si está en modo placeholder, simular la acción de adelanto
      console.log('Skip ejecutado!');
      this.currentSkipInterval = null;
    }
  }
}
