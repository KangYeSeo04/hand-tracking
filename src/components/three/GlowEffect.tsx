import { Float, Sparkles } from '@react-three/drei';
import { DoubleSide } from 'three';

function GlowEffect() {
  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh position={[0, 0.95, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.55, 0.018, 24, 120]} />
          <meshBasicMaterial color="#5ef2ff" transparent opacity={0.45} />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.18} floatIntensity={0.8}>
        <mesh position={[0, 1.15, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 1.88, 80]} />
          <meshBasicMaterial color="#8dfdff" transparent opacity={0.12} side={DoubleSide} />
        </mesh>
      </Float>

      <Sparkles
        count={65}
        scale={[5.5, 4.8, 3.5]}
        size={2.2}
        speed={0.18}
        opacity={0.55}
        color="#7ffaff"
      />
    </group>
  );
}

export default GlowEffect;
