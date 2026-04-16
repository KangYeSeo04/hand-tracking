import { useEffect, useRef, useCallback } from 'react';

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface Handedness {
  label: string;
  score: number;
}

export interface HandResults {
  multiHandLandmarks: HandLandmark[][];
  multiHandedness: Handedness[];
}

interface WebcamLike {
  video: HTMLVideoElement | null;
}

interface UseHandTrackingOptions {
  webcamRef: React.RefObject<WebcamLike | null>;
  onResults: (results: HandResults) => void;
  maxHands?: number;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

/**
 * MediaPipe Hands를 CDN 스크립트로 로드하고
 * 매 프레임마다 손 인식 결과를 콜백으로 전달하는 훅
 */
export function useHandTracking({
  webcamRef,
  onResults,
  maxHands = 2,
  minDetectionConfidence = 0.7,
  minTrackingConfidence = 0.5,
}: UseHandTrackingOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handsRef = useRef<any>(null);
  const rafRef = useRef<number>(0);

  const detect = useCallback(async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      handsRef.current
    ) {
      await handsRef.current.send({ image: webcamRef.current.video });
    }
    rafRef.current = requestAnimationFrame(detect);
  }, [webcamRef]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // CDN에서 스크립트 로드
      if (!(window as any).Hands) { // eslint-disable-line @typescript-eslint/no-explicit-any
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
          script.crossOrigin = 'anonymous';
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (cancelled) return;

      const HandsClass = (window as any).Hands; // eslint-disable-line @typescript-eslint/no-explicit-any
      const hands = new HandsClass({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: maxHands,
        modelComplexity: 1,
        minDetectionConfidence,
        minTrackingConfidence,
      });

      hands.onResults(onResults);
      handsRef.current = hands;

      // 웹캠이 준비되면 감지 시작
      const checkReady = setInterval(() => {
        if (cancelled) {
          clearInterval(checkReady);
          return;
        }
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4
        ) {
          clearInterval(checkReady);
          detect();
        }
      }, 100);
    }

    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [maxHands, minDetectionConfidence, minTrackingConfidence, onResults, detect, webcamRef]);
}
