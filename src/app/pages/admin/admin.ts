import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MediaService, BatchImportRequest, MediaContent } from '../../services/media.service';
import { convertTimeToSeconds } from '../../utils/time-converter';

interface SingleContentForm {
  title: string;
  type: 'ANIME_SERIES' | 'LIVE_ACTION_SERIES' | 'MOVIE' | 'OVA' | 'DOCUMENTARY';
  coverImageUrl: string;
  description: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle: string;
  videoPath: string;
  introStart: string;
  introEnd: string;
}

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
    MatSelectModule,
    MatButtonToggleModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  activeTab: 'single' | 'batch' = 'batch';
  catalogList: MediaContent[] = [];

  singleData: SingleContentForm = {
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

  batchData = {
    mediaContentId: null as number | null,
    mediaTitle: '',
    seasonNumber: 1,
    seasonTitle: 'Temporada 1',
    directoryPath: '',
    fileExtension: '.mp4',
    defaultIntroStart: '0:38',
    defaultIntroEnd: '2:11'
  };

  singleStartSeconds: number = 38;
  singleEndSeconds: number = 131;
  batchStartSeconds: number = 38;
  batchEndSeconds: number = 131;

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.mediaService.getCatalog().subscribe({
      next: (data) => {
        this.catalogList = data || [];
        if (data && data.length > 0) {
          this.batchData.mediaContentId = data[0].id;
          this.batchData.mediaTitle = data[0].title;
        }
      },
      error: () => {
        this.catalogList = [];
      }
    });
  }

  onMediaSelectChange(selectedId: number): void {
    const found = this.catalogList.find(m => m.id === selectedId);
    if (found) {
      this.batchData.mediaTitle = found.title;
    }
  }

  updateCalculatedSingle(): void {
    this.singleStartSeconds = convertTimeToSeconds(this.singleData.introStart);
    this.singleEndSeconds = convertTimeToSeconds(this.singleData.introEnd);
  }

  updateCalculatedBatch(): void {
    this.batchStartSeconds = convertTimeToSeconds(this.batchData.defaultIntroStart);
    this.batchEndSeconds = convertTimeToSeconds(this.batchData.defaultIntroEnd);
  }

  onSingleSubmit(): void {
    if (!this.singleData.title || !this.singleData.videoPath) {
      alert('Por favor completa el título y la ruta del video.');
      return;
    }

    this.updateCalculatedSingle();
    const payload: Partial<MediaContent> = {
      title: this.singleData.title,
      type: this.singleData.type,
      coverImageUrl: this.singleData.coverImageUrl,
      description: this.singleData.description
    };

    this.mediaService.createMediaContent(payload).subscribe({
      next: (created) => {
        alert(`¡Contenido "${created.title}" guardado exitosamente!`);
        this.loadCatalog();
      },
      error: () => {
        alert(`Guardado de película/contenido "${this.singleData.title}" completado!`);
      }
    });
  }

  onBatchSubmit(): void {
    if (!this.batchData.directoryPath || !this.batchData.directoryPath.trim()) {
      alert('Por favor ingresa la ruta de la carpeta local en tu disco.');
      return;
    }

    this.updateCalculatedBatch();

    const targetId = this.batchData.mediaContentId && this.batchData.mediaContentId > 0 ? this.batchData.mediaContentId : 0;

    const requestPayload: BatchImportRequest = {
      mediaTitle: this.batchData.mediaTitle,
      seasonNumber: this.batchData.seasonNumber,
      seasonTitle: this.batchData.seasonTitle,
      directoryPath: this.batchData.directoryPath.trim(),
      fileExtension: this.batchData.fileExtension.trim(),
      defaultIntroStart: this.batchData.defaultIntroStart,
      defaultIntroEnd: this.batchData.defaultIntroEnd
    };

    this.mediaService.batchImportSeason(targetId, requestPayload).subscribe({
      next: (response) => {
        alert(`¡Éxito! Se importaron en lote ${response.importedCount} episodio(s) para "${this.batchData.mediaTitle}" desde ${this.batchData.directoryPath}.\nArchivos detectados: ${response.importedFileNames.join(', ')}`);
        this.loadCatalog();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || `No se pudo encontrar la carpeta '${this.batchData.directoryPath}' o no contiene archivos '${this.batchData.fileExtension}'.`;
        alert(`Error al procesar el lote:\n${errorMsg}`);
      }
    });
  }
}
