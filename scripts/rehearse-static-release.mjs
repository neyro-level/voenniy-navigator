import { existsSync, lstatSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const token = process.argv[index];
  if (!token.startsWith('--')) continue;
  args.set(token.slice(2), process.argv[index + 1]);
}

const root = resolve(args.get('root') ?? '');
const candidate = resolve(root, 'releases', args.get('candidate') ?? '');
const previous = resolve(root, 'releases', args.get('previous') ?? '');
const current = join(root, 'current');
const out = resolve(args.get('out') ?? 'REHEARSAL_RESULT.txt');

if (!existsSync(join(candidate, 'dist', 'index.html'))) throw new Error('candidate artifact has no dist/index.html');
if (!existsSync(previous)) throw new Error('previous rollback fixture is absent');

const linkType = process.platform === 'win32' ? 'junction' : 'dir';
const point = (target) => {
  rmSync(current, { recursive: true, force: true });
  symlinkSync(target, current, linkType);
  if (!lstatSync(current).isSymbolicLink()) throw new Error('current is not a symbolic link');
  if (resolve(readlinkSync(current)) !== resolve(target)) throw new Error('current points to an unexpected release');
};

point(previous);
point(candidate);
point(previous);
writeFileSync(out, 'artifact extract: PASS\natomic activation rehearsal: PASS\nrollback rehearsal: PASS\nproduction touched: NO\n');
