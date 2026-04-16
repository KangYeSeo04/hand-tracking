import { HAND_CONNECTIONS, HAND_COLORS, JOINT_RADIUS, BONE_WIDTH } from '../constants/hand';

interface Landmark {
  x: number;
  y: number;
  z: number;
}

/**
 * 캔버스에 손 관절과 뼈대를 그리는 함수
 * @param ctx - 캔버스 2D 컨텍스트
 * @param landmarks - 손 관절 좌표 배열 (21개)
 * @param handedness - 'Left' | 'Right' (MediaPipe 기준, 미러링 시 반대)
 * @param width - 캔버스 너비
 * @param height - 캔버스 높이
 */
export function drawHandLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  handedness: string,
  width: number,
  height: number,
) {
  // 미러링이므로 MediaPipe의 Left는 화면상 왼손
  const colors = handedness === 'Left' ? HAND_COLORS.left : HAND_COLORS.right;

  // 뼈대 (연결선) 그리기
  ctx.strokeStyle = colors.bone;
  ctx.lineWidth = BONE_WIDTH;
  ctx.lineCap = 'round';

  for (const [start, end] of HAND_CONNECTIONS) {
    const s = landmarks[start];
    const e = landmarks[end];
    ctx.beginPath();
    ctx.moveTo((1 - s.x) * width, s.y * height);
    ctx.lineTo((1 - e.x) * width, e.y * height);
    ctx.stroke();
  }

  // 관절 (원) 그리기
  ctx.fillStyle = colors.joint;
  ctx.shadowColor = colors.joint;
  ctx.shadowBlur = 10;

  for (const lm of landmarks) {
    ctx.beginPath();
    ctx.arc((1 - lm.x) * width, lm.y * height, JOINT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
}
