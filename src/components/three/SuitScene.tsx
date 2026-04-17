import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import SuitModel from './SuitModel';

/**
 * 카메라 배경 위에 투명 오버레이로 깔리는 R3F Canvas.
 * - alpha 활성화로 웹캠 피드가 비쳐 보이게 함
 * - 홀로그램 분위기의 조명 + 환경 설정
 */
export default function SuitScene() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        // Phase 2: OrbitControls 조작을 위해 auto, 제스처 제어 도입 시 'none'으로
        pointerEvents: 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 1, 3.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        {/* 개발 중 카메라 컨트롤 - 추후 제스처 제어로 대체 */}
        <OrbitControls
          enablePan={false}
          enableZoom
          target={[0, 0.8, 0]}
        />

        {/* 전체적으로 어둡고 푸른 기본광 */}
        <ambientLight intensity={0.25} color="#4466ff" />

        {/* 키 라이트 - 정면 상단 시안 */}
        <directionalLight
          position={[2, 4, 3]}
          intensity={1.5}
          color="#00e5ff"
        />

        {/* 필 라이트 - 후면 레드 (스파이더맨 컬러) */}
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.8}
          color="#ff2a5f"
        />

        {/* 림 라이트 - 위에서 화이트 */}
        <pointLight
          position={[0, 3, 1]}
          intensity={1.2}
          color="#ffffff"
          distance={6}
        />

        {/* 환경광 (반사용) */}
        <Environment preset="night" background={false} />

        <SuitModel />
      </Canvas>
    </div>
  );
}
