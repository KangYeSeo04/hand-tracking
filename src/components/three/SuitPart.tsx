import { useMemo } from 'react';
import type { Euler, BufferGeometry, Vector3Tuple, ColorRepresentation } from 'three';
import { MeshBasicMaterial, MeshPhysicalMaterial } from 'three';
import { hologramMaterial } from '../../constants/suit';

interface SuitPartProps {
  geometry: BufferGeometry;
  color?: ColorRepresentation;
  position?: Vector3Tuple;
  rotation?: Euler | Vector3Tuple;
  scale?: Vector3Tuple;
}

function SuitPart({
  geometry,
  color,
  position = [0, 0, 0],
  rotation,
  scale = [1, 1, 1],
}: SuitPartProps) {
  const shellMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        ...hologramMaterial,
        color: color ?? hologramMaterial.color,
      }),
    [color],
  );

  const wireMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: '#9ffcff',
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    [],
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry} material={shellMaterial} />
      <mesh geometry={geometry} material={wireMaterial} renderOrder={2} />
    </group>
  );
}

export default SuitPart;
