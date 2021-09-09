import React, { useEffect, useRef } from 'react';
import { useAsync } from 'react-use';

import { withErrorBoundary } from 'components/ErrorBoundary';

const HEIGHT = 600;

const wait = (millis) => new Promise((resolve) => setTimeout(resolve, millis));

const PlaySketch = ({ game }) => {
  const {
    loading,
    error,
    value: modules,
  } = useAsync(async () => {
    const [p5, sketch] = await Promise.all([
      import('p5'),
      import(`lib/sketches/${game.id}`),
      wait(1500), // wait for animation to finish
    ]);
    return { p5: p5.default, sketch: sketch.default };
  }, [game.id]);

  const containerRef = useRef();
  const sketchRef = useRef();

  useEffect(() => {
    if (!modules) return;

    const w = containerRef.current.clientWidth;
    // const h = containerRef.current.clientHeight;

    const { sketch, p5: P5 } = modules;

    const sketchInstance = new P5(
      (p5) => sketch(p5, w, HEIGHT, P5),
      sketchRef.current,
    );

    return () => {
      sketchInstance.remove();
    };
  }, [modules]);

  let content;
  if (error) {
    console.error(error);
    content = <p className="shadowed error">Failed to load game :(</p>;
  } else if (loading)
    content = <div className="loading shadowed" style={{ height: HEIGHT }} />;
  else
    content = (
      <div
        ref={sketchRef}
        className="shadowed"
        style={{ height: HEIGHT, display: 'inline-block', margin: '0 auto' }}
      />
    );

  return (
    <div ref={containerRef} className="text-center">
      {content}
    </div>
  );
};

export default withErrorBoundary(PlaySketch);
