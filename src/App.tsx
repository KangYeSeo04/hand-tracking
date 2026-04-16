import { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import WebcamBackground from './components/camera/WebcamBackground';
import HandCanvas from './components/camera/HandCanvas';
import { useHandTracking } from './hooks/useHandTracking';
import type { HandResults } from './hooks/useHandTracking';
import { drawHandLandmarks } from './utils/drawHands';

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onResults = useCallback((results: HandResults) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기를 화면에 맞춤
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 이전 프레임 지우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 손이 감지되면 그리기
    if (results.multiHandLandmarks && results.multiHandedness) {
      results.multiHandLandmarks.forEach((landmarks, index) => {
        const handedness = results.multiHandedness[index].label;
        drawHandLandmarks(ctx, landmarks, handedness, canvas.width, canvas.height);
      });
    }
  }, []);

  useHandTracking({
    webcamRef,
    onResults,
  });

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <WebcamBackground ref={webcamRef} />
      <HandCanvas ref={canvasRef} />
    </div>
  );
}

export default App;
