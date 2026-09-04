import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SkipTimestamp {
  id: number;
  type: 'INTRO' | 'OUTRO' | 'RECAP';
  startTimeSeconds: number;
  endTimeSeconds: number;
  label: string;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  videoPath: string;
  durationSeconds: number;
  skipTimestamps: SkipTimestamp[];
}

export interface Season {
  id: number;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
  defaultSkipTimestamps?: SkipTimestamp[];
}

export interface MediaContent {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  type: 'ANIME_SERIES' | 'LIVE_ACTION_SERIES' | 'MOVIE' | 'OVA' | 'DOCUMENTARY';
  createdAt: string;
  seasons: Season[];
}

export interface BatchImportRequest {
  mediaTitle?: string;
  seasonNumber?: number;
  seasonTitle?: string;
  directoryPath: string;
  fileExtension?: string;
  defaultIntroStart?: string;
  defaultIntroEnd?: string;
}

export interface BatchImportResponse {
  importedCount: number;
  seasonId: number;
  importedFileNames: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getCatalog(): Observable<MediaContent[]> {
    return this.http.get<MediaContent[]>(`${this.apiUrl}/media`);
  }

  getMediaContentDetails(id: number | string): Observable<MediaContent> {
    return this.http.get<MediaContent>(`${this.apiUrl}/media/${id}`);
  }

  createMediaContent(payload: Partial<MediaContent>): Observable<MediaContent> {
    return this.http.post<MediaContent>(`${this.apiUrl}/media`, payload);
  }

  batchImportSeason(mediaContentId: number | string, payload: BatchImportRequest): Observable<BatchImportResponse> {
    return this.http.post<BatchImportResponse>(`${this.apiUrl}/media/${mediaContentId}/batch-import`, payload);
  }

  batchImportEpisodes(seasonId: number | string, payload: BatchImportRequest): Observable<BatchImportResponse> {
    return this.http.post<BatchImportResponse>(`${this.apiUrl}/seasons/${seasonId}/batch-import`, payload);
  }

  getSkipTimestamps(episodeId: number | string): Observable<SkipTimestamp[]> {
    return this.http.get<SkipTimestamp[]>(`${this.apiUrl}/episodes/${episodeId}/skip-timestamps`);
  }

  getVideoStreamUrl(episodeId: number | string): string {
    return `${this.apiUrl}/videos/stream/${episodeId}`;
  }
}
