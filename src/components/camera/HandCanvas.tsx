import { forwardRef } from 'react';

const HandCanvas = forwardRef<HTMLCanvasElement>((_, ref) => {
  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
});

HandCanvas.displayName = 'HandCanvas';

export default HandCanvas;
