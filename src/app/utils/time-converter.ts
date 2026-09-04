export function convertTimeToSeconds(timeInput: string | number): number {
  if (typeof timeInput === 'number') {
    return timeInput;
  }
  if (!timeInput || typeof timeInput !== 'string') {
    return 0;
  }

  const timeSegments = timeInput.trim().split(':').map(segment => parseInt(segment, 10));
  if (timeSegments.some(isNaN)) {
    return 0;
  }

  const isRawSeconds = timeSegments.length === 1;
  if (isRawSeconds) {
    return timeSegments[0];
  }

  const isMinutesSeconds = timeSegments.length === 2;
  if (isMinutesSeconds) {
    const [minutes, seconds] = timeSegments;
    return minutes * 60 + seconds;
  }

  const isHoursMinutesSeconds = timeSegments.length === 3;
  if (isHoursMinutesSeconds) {
    const [hours, minutes, seconds] = timeSegments;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
}

export function convertSecondsToFormattedTime(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) {
    return '00:00';
  }

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const formatTwoDigits = (value: number) => value.toString().padStart(2, '0');

  return `${formatTwoDigits(minutes)}:${formatTwoDigits(remainingSeconds)}`;
}

export const timeStringToSeconds = convertTimeToSeconds;
export const secondsToTimeString = convertSecondsToFormattedTime;
