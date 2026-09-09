import React, { useEffect, useState, useRef } from 'react';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import './WandCursor.css';

const WandCursor = () => {
  const { wandCursorEnabled } = useMagicalScene();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [sparks, setSparks] = useState([]);
  const sparkId = useRef(0);

  useEffect(() => {
    if (!wandCursorEnabled) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Spawn spark on motion randomly
      if (Math.random() > 0.6) {
        sparkId.current += 1;
        const newSpark = {
          id: sparkId.current,
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 1,
          size: Math.random() * 4 + 2
        };

        setSparks((prev) => [...prev.slice(-15), newSpark]);
      }
    };

    const handleMouseDown = (e) => {
      setIsClicking(true);
      // Burst of sparks on click
      const burst = Array.from({ length: 8 }).map((_, i) => {
        sparkId.current += 1;
        const angle = (i / 8) * Math.PI * 2;
        return {
          id: sparkId.current,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * (Math.random() * 3 + 2),
          vy: Math.sin(angle) * (Math.random() * 3 + 2),
          size: Math.random() * 6 + 3
        };
      });
      setSparks((prev) => [...prev.slice(-10), ...burst]);
    };

    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [wandCursorEnabled]);

  // Clean up fading sparks
  useEffect(() => {
    if (sparks.length === 0) return;
    const timer = setTimeout(() => {
      setSparks((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [sparks]);

  if (!wandCursorEnabled) return null;

  return (
    <div className="wand-cursor-layer" aria-hidden="true">
      {/* Wand Tip Glow */}
      <div
        className={`wand-tip ${isClicking ? 'casting' : ''}`}
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      />

      {/* Trailing lumos sparks */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="wand-spark"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            transform: `translate(${spark.vx * 8}px, ${spark.vy * 8}px)`
          }}
        />
      ))}
    </div>
  );
};

export default WandCursor;
