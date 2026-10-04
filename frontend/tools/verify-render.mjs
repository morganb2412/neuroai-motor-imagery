import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
await mkdir('.validation',{recursive:true});
await build({entryPoints:['tools/verify-render.tsx'],outfile:'.validation/render.mjs',bundle:true,platform:'node',format:'esm',jsx:'automatic',packages:'external',loader:{'.svg':'dataurl','.webp':'dataurl'},define:{'import.meta.env':'{}'}});
await import('../.validation/render.mjs');
