import { Component, Input, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MediaService, MediaContent, Season, Episode, SkipTimestamp } from '../../services/media.service';

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
  templateUrl: './player.html',
  styleUrl: './player.scss'
})
export class PlayerComponent implements OnInit {
  @Input() id!: string;
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;

  mediaContent: MediaContent | null = null;
  selectedSeason: Season | null = null;
  selectedEpisode: Episode | null = null;
  videoStreamUrl: string = '';
  showPlaceholder: boolean = true;
  skipIntervals: SkipTimestamp[] = [];
  currentSkipInterval: SkipTimestamp | null = null;

  constructor(
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.loadMediaContentDetails(this.id);
    }
  }

  loadMediaContentDetails(contentId: string): void {
    const targetEpId = this.route.snapshot.queryParams['episodeId'];

    this.mediaService.getMediaContentDetails(contentId).subscribe({
      next: (data) => {
        this.mediaContent = data;
        if (data.seasons && data.seasons.length > 0) {
          data.seasons.sort((a, b) => (a.seasonNumber || 0) - (b.seasonNumber || 0));
          data.seasons.forEach(season => {
            if (season.episodes) {
              season.episodes.sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
            }
          });

          if (targetEpId) {
            const requestedEpId = parseInt(targetEpId, 10);
            for (const season of data.seasons) {
              const matchedEp = season.episodes?.find(e => e.id === requestedEpId);
              if (matchedEp) {
                this.selectedSeason = season;
                this.selectEpisode(matchedEp);
                return;
              }
            }
          }
          this.selectSeason(data.seasons[0]);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadDirectEpisodeFallback(contentId);
      }
    });
  }

  selectSeason(season: Season): void {
    this.selectedSeason = season;
    if (season.episodes && season.episodes.length > 0) {
      this.selectEpisode(season.episodes[0]);
    } else {
      this.selectedEpisode = null;
      this.videoStreamUrl = '';
      this.showPlaceholder = true;
    }
    this.cdr.detectChanges();
  }

  selectEpisode(episode: Episode): void {
    this.selectedEpisode = episode;
    this.videoStreamUrl = this.mediaService.getVideoStreamUrl(episode.id);
    this.showPlaceholder = false;
    this.loadSkipTimestamps(episode.id);
    this.cdr.detectChanges();
  }

  loadSkipTimestamps(episodeId: number): void {
    this.mediaService.getSkipTimestamps(episodeId).subscribe({
      next: (timestamps) => {
        this.skipIntervals = timestamps || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.skipIntervals = [];
        this.cdr.detectChanges();
      }
    });
  }

  loadDirectEpisodeFallback(episodeIdStr: string): void {
    const episodeIdNum = parseInt(episodeIdStr, 10);
    this.videoStreamUrl = this.mediaService.getVideoStreamUrl(episodeIdNum);
    this.showPlaceholder = false;
    this.loadSkipTimestamps(episodeIdNum);
    this.cdr.detectChanges();
  }

  onTimeUpdate(event: Event): void {
    const video = event.target as HTMLVideoElement;
    if (!video) return;

    if (video.currentTime > 0) {
      this.showPlaceholder = false;
    }

    const currentTime = video.currentTime;
    this.currentSkipInterval = this.skipIntervals.find(
      interval => currentTime >= interval.startTimeSeconds && currentTime <= interval.endTimeSeconds
    ) || null;
    this.cdr.detectChanges();
  }

  executeSkip(): void {
    if (this.currentSkipInterval && this.videoPlayerRef && this.videoPlayerRef.nativeElement) {
      this.videoPlayerRef.nativeElement.currentTime = this.currentSkipInterval.endTimeSeconds;
      this.currentSkipInterval = null;
      this.cdr.detectChanges();
    } else {
      this.currentSkipInterval = null;
      this.cdr.detectChanges();
    }
  }
}
