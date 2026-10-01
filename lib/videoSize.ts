import fs from 'fs';

interface Size {
  width: number;
  height: number;
}

const CONTAINER_BOXES = new Set(['moov', 'trak']);

// Wymiary MP4 czytane wprost z nagłówka ścieżki wideo (box `tkhd`) — bez ffmpeg, żeby
// działało też przy buildzie na Vercel. Czytane są tylko nagłówki boxów, nie cały plik.
export function getMp4Size(filePath: string): Size | null {
  const fd = fs.openSync(filePath, 'r');
  try {
    return findTrackSize(fd, 0, fs.fstatSync(fd).size);
  } catch {
    return null;
  } finally {
    fs.closeSync(fd);
  }
}

function findTrackSize(fd: number, start: number, end: number): Size | null {
  const header = Buffer.alloc(16);
  let offset = start;

  while (offset + 8 <= end) {
    fs.readSync(fd, header, 0, 16, offset);
    const type = header.toString('latin1', 4, 8);
    let size = header.readUInt32BE(0);
    let headerSize = 8;
    if (size === 1) {
      size = Number(header.readBigUInt64BE(8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }
    if (size < headerSize) return null;

    if (CONTAINER_BOXES.has(type)) {
      const found = findTrackSize(fd, offset + headerSize, offset + size);
      if (found) return found;
    } else if (type === 'tkhd') {
      const found = readTkhd(fd, offset + headerSize, size - headerSize);
      if (found) return found;
    }

    offset += size;
  }

  return null;
}

function readTkhd(fd: number, start: number, length: number): Size | null {
  const box = Buffer.alloc(Math.min(length, 104));
  fs.readSync(fd, box, 0, box.length, start);
  // Wersja 1 ma 64-bitowe znaczniki czasu, więc dalsze pola są przesunięte o 12 bajtów.
  const matrixOffset = box[0] === 1 ? 52 : 40;
  if (box.length < matrixOffset + 44) return null;

  // Szerokość i wysokość to liczby stałoprzecinkowe 16.16; ścieżki audio mają tu zera.
  const width = box.readUInt32BE(matrixOffset + 36) / 65536;
  const height = box.readUInt32BE(matrixOffset + 40) / 65536;
  if (!width || !height) return null;

  // Nagranie obrócone o 90°/270° (np. pionowe z telefonu) ma wyzerowaną przekątną macierzy.
  const rotated = box.readInt32BE(matrixOffset) === 0 && box.readInt32BE(matrixOffset + 16) === 0;
  return rotated ? { width: height, height: width } : { width, height };
}
