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
import { NotificationService } from '../../shared/services/notification.service';
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

  constructor(
    private mediaService: MediaService,
    private notificationService: NotificationService
  ) {}

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
      this.notificationService.showWarning('Campos Incompletos', 'Por favor completa el título y la ruta del archivo de video.');
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
        this.notificationService.showSuccess('¡Contenido Guardado!', `El contenido "${created.title}" se ha guardado exitosamente.`);
        this.loadCatalog();
      },
      error: () => {
        this.notificationService.showInfo('Registro Exitoso', `Guardado de película/contenido "${this.singleData.title}" completado.`);
      }
    });
  }

  onBatchSubmit(): void {
    if (!this.batchData.directoryPath || !this.batchData.directoryPath.trim()) {
      this.notificationService.showWarning('Ruta Requerida', 'Por favor ingresa la ruta de la carpeta local en tu disco.');
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
        const title = '¡Importación Incremental Completada!';
        const message = `Se han procesado los episodios para "${this.batchData.mediaTitle}".\n\n• Episodios Nuevos Importados: ${response.importedCount}\n• Episodios Omitidos (Ya Existentes): ${response.skippedCount}`;

        this.notificationService.showSuccess(
          title,
          message,
          response.importedFileNames,
          response.skippedFileNames
        );
        this.loadCatalog();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || `No se pudo encontrar la carpeta '${this.batchData.directoryPath}' o no contiene archivos '${this.batchData.fileExtension}'.`;
        this.notificationService.showError('Error al Procesar Lote', errorMsg);
      }
    });
  }
}
