import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const directory = resolve(process.argv[2] ?? '');
const prefix = process.argv[3] ?? '';
const out = resolve(process.argv[4] ?? 'RELEASE_PARTS.json');
const parts = readdirSync(directory)
  .filter((name) => name.startsWith(prefix))
  .sort()
  .map((name) => {
    const path = join(directory, name);
    return {
      file: name,
      bytes: statSync(path).size,
      sha256: createHash('sha256').update(readFileSync(path)).digest('hex'),
    };
  });

if (parts.length !== 3) throw new Error(`expected exactly 3 transport parts, received ${parts.length}`);
writeFileSync(out, `${JSON.stringify({ contractVersion: 1, assembleOrder: parts.map((part) => part.file), parts }, null, 2)}\n`);
