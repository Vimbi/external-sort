import * as readline from 'node:readline';
import { createWriteStream } from 'fs';
import { maxRam } from '../app';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export const merge = async (tmpFileNames: string[], fileName: string) => {
  const resultFileName = `${fileName.split('.txt')[0]}-sorted.txt`;
  const file = createWriteStream(resultFileName, {
    highWaterMark: maxRam,
  });
  const activeReaders = tmpFileNames.map((name) =>
    readline
      .createInterface({
        input: createReadStream(name, { highWaterMark: maxRam }),
        crlfDelay: Infinity,
      })
      [Symbol.asyncIterator]()
  );
  const values = await Promise.all(
    activeReaders.map((r) => r.next().then((e) => e.value))
  );
  return pipeline(async function* () {
    while (activeReaders.length > 0) {
      const [minVal, i] =
        values.length < 2
          ? [values[0], 0]
          : values[0].localeCompare(values[1]) < 1
          ? [values[0], 0]
          : [values[1], 1];

      yield `${minVal}\n`;

      const res = await activeReaders[i].next();
      if (!res.done) {
        values[i] = res.value;
      } else {
        values.splice(i, 1);
        activeReaders.splice(i, 1);
      }
    }
  }, file);
};
