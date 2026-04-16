// MediaPipe Hands 관절 연결 쌍 (선으로 이어줄 인덱스)
export const HAND_CONNECTIONS: [number, number][] = [
  // 엄지
  [0, 1], [1, 2], [2, 3], [3, 4],
  // 검지
  [0, 5], [5, 6], [6, 7], [7, 8],
  // 중지
  [0, 9], [9, 10], [10, 11], [11, 12],
  // 약지
  [0, 13], [13, 14], [14, 15], [15, 16],
  // 소지
  [0, 17], [17, 18], [18, 19], [19, 20],
  // 손바닥 가로 연결
  [5, 9], [9, 13], [13, 17],
];

// 손 색상
export const HAND_COLORS = {
  left: { joint: '#00ffff', bone: 'rgba(0, 255, 255, 0.6)' },   // 시안
  right: { joint: '#ff00ff', bone: 'rgba(255, 0, 255, 0.6)' },  // 마젠타
};

export const JOINT_RADIUS = 5;
export const BONE_WIDTH = 3;
