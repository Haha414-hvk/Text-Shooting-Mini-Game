import { useEffect } from 'react';
import type { RefObject } from 'react';

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function GameCanvas({ canvasRef }: Props) {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('contextmenu', handleContextMenu);
    return () => canvas.removeEventListener('contextmenu', handleContextMenu);
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{
        display: 'block',
        border: '2px solid #333',
        borderRadius: 4,
        cursor: 'none',
      }}
    />
  );
}
