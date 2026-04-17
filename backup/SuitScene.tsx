import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import SuitModel from './SuitModel';
import GlowEffect from './GlowEffect';

function SuitScene() {
  return (
    <div className="scene-overlay" aria-hidden="true">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 1.1, 6.2], fov: 32 }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.9} color="#a8f8ff" />
        <hemisphereLight intensity={0.85} color="#9eefff" groundColor="#04131e" />
        <directionalLight position={[2.5, 3.5, 4]} intensity={2.8} color="#d7fdff" />
        <pointLight position={[-3, 1, 2]} intensity={15} distance={8} color="#0cb3ff" />
        <spotLight position={[0, 5, 3]} intensity={18} angle={0.35} penumbra={0.8} color="#72fbff" />

        <GlowEffect />
        <SuitModel />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

export default SuitScene;
