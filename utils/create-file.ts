import { fileSize, maxRam } from '../app';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

function* stringsGenerator(): Generator<string> {
  let bytes = 0;
  while (bytes < fileSize) {
    let x = Math.random().toString(36).substring(7);
    const data = `${x}\n`;
    bytes += data.length;
    yield data;
  }
}

export const createFile = async (fileName: string) => {
  return pipeline(
    stringsGenerator(),
    createWriteStream(fileName, { highWaterMark: maxRam })
  );
};
