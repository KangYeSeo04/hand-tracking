import { readFileSync } from 'fs';

const path = process.argv[2] || 'public/models/spiderman.glb';

// gltf-transform이 없을 수도 있으니 수동 파싱
const buf = readFileSync(path);
const magic = buf.readUInt32LE(0);
if (magic !== 0x46546c67) {
  console.error('Not a GLB file');
  process.exit(1);
}

// GLB 헤더: magic(4) + version(4) + length(4) = 12
// JSON chunk: length(4) + type(4) + data
const jsonLen = buf.readUInt32LE(12);
const jsonChunk = buf.slice(20, 20 + jsonLen).toString('utf-8');
const gltf = JSON.parse(jsonChunk);

console.log('=== GLB 구조 분석 ===\n');
console.log(`Scenes: ${gltf.scenes?.length ?? 0}`);
console.log(`Nodes: ${gltf.nodes?.length ?? 0}`);
console.log(`Meshes: ${gltf.meshes?.length ?? 0}`);
console.log(`Materials: ${gltf.materials?.length ?? 0}`);
console.log(`Textures: ${gltf.textures?.length ?? 0}`);
console.log(`Animations: ${gltf.animations?.length ?? 0}`);
console.log(`Skins: ${gltf.skins?.length ?? 0}\n`);

console.log('=== 노드 트리 ===');
function printNode(idx, depth = 0) {
  const n = gltf.nodes[idx];
  const indent = '  '.repeat(depth);
  const meshInfo = n.mesh !== undefined ? ` [mesh=${n.mesh}: ${gltf.meshes[n.mesh]?.name ?? '?'}]` : '';
  console.log(`${indent}- ${n.name ?? `(node ${idx})`}${meshInfo}`);
  if (n.children) n.children.forEach(c => printNode(c, depth + 1));
}
const scene = gltf.scenes[gltf.scene ?? 0];
scene.nodes.forEach(n => printNode(n));

console.log('\n=== 메시 목록 ===');
gltf.meshes?.forEach((m, i) => {
  const matNames = m.primitives.map(p =>
    p.material !== undefined ? gltf.materials[p.material]?.name ?? `mat${p.material}` : '-'
  ).join(', ');
  console.log(`  [${i}] ${m.name ?? '(unnamed)'} — ${m.primitives.length} prim(s), mats: ${matNames}`);
});

console.log('\n=== 머티리얼 목록 ===');
gltf.materials?.forEach((m, i) => {
  console.log(`  [${i}] ${m.name ?? '(unnamed)'}`);
});
