/**
 * Convierte un texto en formato "MM:SS" o "HH:MM:SS" (ej. "0:38" o "02:11") a segundos totales.
 * Si el usuario ingresa un número simple, se asume como segundos.
 */
export function timeStringToSeconds(timeStr: string | number): number {
  if (typeof timeStr === 'number') return timeStr;
  if (!timeStr || typeof timeStr !== 'string') return 0;

  const parts = timeStr.trim().split(':').map(p => parseInt(p, 10));
  if (parts.some(isNaN)) return 0;

  if (parts.length === 1) return parts[0]; // Solo segundos (ej. "38" -> 38)
  if (parts.length === 2) return parts[0] * 60 + parts[1]; // MM:SS (ej. "2:11" -> 2*60 + 11 = 131)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  return 0;
}

/**
 * Convierte segundos totales al formato legible "MM:SS".
 * Ejemplo: 131 -> "02:11" | 38 -> "00:38"
 */
export function secondsToTimeString(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
}
