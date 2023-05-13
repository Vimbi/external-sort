import { rm } from 'fs/promises';

export const clean = (tmpFileNames: string[]) => {
  return Promise.all(tmpFileNames.map((f) => rm(f)));
};