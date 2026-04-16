import { forwardRef } from 'react';
import Webcam from 'react-webcam';

const WebcamBackground = forwardRef<Webcam>((_, ref) => {
  return (
    <Webcam
      ref={ref}
      mirrored
      audio={false}
      videoConstraints={{
        width: 1280,
        height: 720,
        facingMode: 'user',
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: 0,
      }}
    />
  );
});

WebcamBackground.displayName = 'WebcamBackground';

export default WebcamBackground;
