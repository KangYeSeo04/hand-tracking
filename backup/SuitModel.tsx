import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import {
  BoxGeometry,
  CapsuleGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  SphereGeometry,
  TorusGeometry,
} from 'three';
import SuitPart from './SuitPart';
import { suitParts } from '../../constants/suit';
import { hologramMaterial } from '../../constants/suit';

const MODEL_URL = '/models/spider-suit.glb';

function ProceduralSuitModel() {
  const geometries = useMemo(
    () => ({
      helmet: new SphereGeometry(0.42, 48, 48),
      torso: new CapsuleGeometry(0.52, 1.85, 8, 20),
      chestCore: new TorusGeometry(0.14, 0.055, 24, 64),
      eye: new BoxGeometry(0.22, 0.085, 0.02),
      gauntlet: new CapsuleGeometry(0.16, 0.55, 8, 18),
      leg: new CapsuleGeometry(0.18, 1.1, 8, 18),
    }),
    [],
  );

  return (
    <group position={[0, -1.15, 0]} rotation={[0.08, 0.35, 0]}>
      <SuitPart
        geometry={geometries.helmet}
        color={suitParts[0].color}
        position={suitParts[0].position}
        scale={[0.88, 1.05, 0.92]}
      />
      <SuitPart geometry={geometries.torso} color={suitParts[1].color} position={suitParts[1].position} />
      <SuitPart
        geometry={geometries.chestCore}
        color={suitParts[2].color}
        position={suitParts[2].position}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <SuitPart
        geometry={geometries.eye}
        color={suitParts[3].color}
        position={suitParts[3].position}
        rotation={[0.2, 0.18, -0.08]}
      />
      <SuitPart
        geometry={geometries.eye}
        color={suitParts[4].color}
        position={suitParts[4].position}
        rotation={[0.2, -0.18, 0.08]}
      />
      <SuitPart
        geometry={geometries.gauntlet}
        color={suitParts[5].color}
        position={suitParts[5].position}
        rotation={[0, 0, -0.95]}
      />
      <SuitPart
        geometry={geometries.gauntlet}
        color={suitParts[6].color}
        position={suitParts[6].position}
        rotation={[0, 0, 0.95]}
      />
      <SuitPart geometry={geometries.leg} color={suitParts[7].color} position={suitParts[7].position} rotation={[0, 0, 0.08]} />
      <SuitPart geometry={geometries.leg} color={suitParts[8].color} position={suitParts[8].position} rotation={[0, 0, -0.08]} />
    </group>
  );
}

function GltfSuitModel({ url }: { url: string }) {
  const gltf = useGLTF(url);

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      const hologram = new MeshPhysicalMaterial({
        ...hologramMaterial,
        color: suitParts[Math.abs(child.id) % suitParts.length].color,
      });

      child.material = hologram;
      child.castShadow = false;
      child.receiveShadow = false;
    });

    return clone;
  }, [gltf.scene]);

  const hasRenderableMesh = useMemo(() => {
    let renderable = false;
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        renderable = true;
      }
    });
    return renderable;
  }, [scene]);

  if (!hasRenderableMesh) {
    return <ProceduralSuitModel />;
  }

  return (
    <group position={[0, -1.2, 0]} rotation={[0.08, 0.35, 0]} scale={[1.25, 1.25, 1.25]}>
      <primitive object={scene} />
    </group>
  );
}

function SuitModel() {
  const [hasModel, setHasModel] = useState<boolean | null>(null);
  const rootRef = useRef<Group | null>(null);

  useEffect(() => {
    let active = true;

    fetch(MODEL_URL, { method: 'HEAD' })
      .then((response) => {
        if (active) {
          setHasModel(response.ok);
        }
      })
      .catch(() => {
        if (active) {
          setHasModel(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useFrame((state) => {
    const sceneRoot = rootRef.current;
    if (!sceneRoot) return;

    sceneRoot.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.18 + 0.26;
    sceneRoot.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <group ref={rootRef} name="suit-root">
      {hasModel ? (
        <Suspense fallback={<ProceduralSuitModel />}>
          <GltfSuitModel url={MODEL_URL} />
        </Suspense>
      ) : (
        <ProceduralSuitModel />
      )}

      {hasModel === false && (
        <Html position={[0, -2.6, 0]} center>
          <div className="model-hint">
            Add <code>public/models/spider-suit.glb</code> to replace the placeholder suit.
          </div>
        </Html>
      )}
    </group>
  );
}

export default SuitModel;
