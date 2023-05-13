import { createFile } from './utils/create-file';
import { externalSort } from './utils/external-sort';

// const maxRam = 524288000; // 500 Gb
// const fileSize = 1099511627776; // 1 Tb

export const maxRam = 5000;
export const fileSize = 100000;

(async function () {
    const fileName = 'new-file.txt';
    await createFile(fileName);
    await externalSort(fileName);
})();
