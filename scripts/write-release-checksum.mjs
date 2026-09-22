import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const artifactPath = resolve(process.argv[2] ?? '');
const checksum = createHash('sha256').update(readFileSync(artifactPath)).digest('hex');
writeFileSync(`${artifactPath}.sha256`, `${checksum}  ${basename(artifactPath)}\n`);
process.stdout.write(`${checksum}\n`);
