import * as THREE from 'three';

export interface HologramMaterial {
  material: THREE.MeshStandardMaterial;
  uniforms: {
    uTime: { value: number };
  };
}

/**
 * 영화 "파 프롬 홈" 토니 스타크 홀로그램 스타일의 셰이더.
 *
 * 구성:
 *  - Fresnel 림: 가장자리는 밝은 시안, 내부는 어두운 네이비 (투과감)
 *  - 수평 스캔라인: 위로 흐르는 라인으로 홀로그램 질감
 *  - 플리커: 고/저 주파수 합성으로 불안정한 전자광 느낌
 *  - depthWrite=false + DoubleSide: 뒤쪽 파츠가 앞으로 비쳐 보이는 X-ray 효과
 *
 * Three의 PBR 최종 출력을 `<dithering_fragment>` 시점에 완전히 덮어쓰는 방식 →
 * 스킨드 메시의 스키닝/노멀 파이프라인은 자동으로 유지되고, 셰이딩만 교체됨.
 */
export function createHologramMaterial(): HologramMaterial {
  const uniforms = {
    uTime: { value: 0 },
  };

  const material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    metalness: 0,
    roughness: 1,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;

    // --- Vertex: 월드 좌표 & 월드 노멀 & 뷰 방향 전달 ---
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        varying vec3 vHoloViewDir;
        varying vec3 vHoloWorldNormal;
        varying vec3 vHoloWorldPos;`,
      )
      // <project_vertex> 직전이면 `transformed`와 `objectNormal`이
      // 스키닝까지 적용된 최종 오브젝트 공간 값으로 준비돼 있음
      .replace(
        '#include <project_vertex>',
        /* glsl */ `
        vec4 _holoWorldPos4 = modelMatrix * vec4(transformed, 1.0);
        vHoloWorldPos = _holoWorldPos4.xyz;
        vHoloWorldNormal = normalize(mat3(modelMatrix) * objectNormal);
        vHoloViewDir = normalize(cameraPosition - vHoloWorldPos);
        #include <project_vertex>`,
      );

    // --- Fragment: 최종 출력을 홀로그램 컬러로 덮어쓰기 ---
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        uniform float uTime;
        varying vec3 vHoloViewDir;
        varying vec3 vHoloWorldNormal;
        varying vec3 vHoloWorldPos;

        #define HOLO_FRESNEL_POWER 2.2
        #define HOLO_RIM_COLOR    vec3(0.2, 0.95, 1.0)
        #define HOLO_DEEP_COLOR   vec3(0.02, 0.10, 0.25)
        #define HOLO_ACCENT_COLOR vec3(1.0, 0.25, 0.45)
        #define HOLO_SCAN_FREQ    55.0
        #define HOLO_SCAN_SPEED   1.2`,
      )
      .replace(
        '#include <dithering_fragment>',
        /* glsl */ `#include <dithering_fragment>
        {
          // Fresnel (가장자리 강조)
          float ndv = abs(dot(normalize(vHoloWorldNormal), normalize(vHoloViewDir)));
          float fresnel = pow(1.0 - ndv, HOLO_FRESNEL_POWER);

          // 수평 스캔라인 (위로 흐름)
          float scanRaw = sin(vHoloWorldPos.y * HOLO_SCAN_FREQ - uTime * HOLO_SCAN_SPEED);
          float scan = smoothstep(0.55, 1.0, scanRaw * 0.5 + 0.5);

          // 느린 브레스 + 빠른 플리커 합성
          float flickerFast = sin(uTime * 37.0) * 0.04;
          float flickerSlow = sin(uTime * 2.1) * 0.06;
          float flicker = 0.92 + flickerFast + flickerSlow;

          // 살짝의 빨강 악센트 (스파이더맨 컬러 흔적)
          float accent = smoothstep(0.85, 1.0, fresnel) * 0.35;

          vec3 holo = mix(HOLO_DEEP_COLOR, HOLO_RIM_COLOR, fresnel);
          holo += HOLO_RIM_COLOR * scan * 0.55;
          holo += HOLO_ACCENT_COLOR * accent;
          holo *= flicker;

          // Fresnel 기반 불투명도 (중앙은 투명, 가장자리는 선명)
          float alpha = mix(0.12, 0.95, fresnel) + scan * 0.25;
          alpha = clamp(alpha, 0.0, 1.0);

          gl_FragColor = vec4(holo, alpha);
        }`,
      );
  };

  return { material, uniforms };
}
