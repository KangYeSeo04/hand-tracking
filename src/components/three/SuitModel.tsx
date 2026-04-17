import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createHologramMaterial } from './HologramMaterial';

const MODEL_URL = '/models/spiderman.glb';
useGLTF.preload(MODEL_URL);

/**
 * Sketchfab "Spider-Man - Hybrid Suit" by Jako (CC Attribution) 로드.
 * 모델은 단일 메시 + 풀 Biped 스켈레톤이라 파츠 분리 불가 →
 * 홀로그램 셰이더를 통째로 적용해 시네마틱한 느낌으로 변환.
 */
export default function SuitModel() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const holo = useRef(createHologramMaterial());

  const prepared = useMemo(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = holo.current.material;
        // 스킨드 메시는 기본 bounding sphere가 부정확해 프러스텀 컬링으로 사라지는 경우가 있음
        mesh.frustumCulled = false;
      }
    });
    return scene;
  }, [scene]);

  const normalized = useMemo(() => {
    const box = new THREE.Box3().setFromObject(prepared);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const targetHeight = 1.8;
    const scale = targetHeight / Math.max(size.y, 0.001);

    return {
      scale,
      position: [
        -center.x * scale,
        -box.min.y * scale,
        -center.z * scale,
      ] as [number, number, number],
    };
  }, [prepared]);

  // 언마운트 시 머티리얼 해제
  useEffect(() => {
    const mat = holo.current.material;
    return () => mat.dispose();
  }, []);

  // 홀로그램 시간 + 느린 부유 + 좌우 회전
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    holo.current.uniforms.uTime.value = t;
    if (groupRef.current) {
      groupRef.current.position.y = 0.3 + Math.sin(t * 0.6) * 0.04;
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <group scale={normalized.scale} position={normalized.position}>
        <primitive object={prepared} />
      </group>
    </group>
  );
}
