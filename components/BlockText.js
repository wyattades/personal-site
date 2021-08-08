import React, { useEffect, useRef } from 'react';
import * as Animated from 'animated/lib/targets/react-dom';
import {
  FontLoader,
  LoadingManager,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  MeshPhongMaterial,
  Vector3,
  Box3,
  TextGeometry,
  Mesh,
  Group,
  DirectionalLight,
} from 'three';

import listenToOrientation from 'lib/orientation';

import fontJson from 'fonts/helv.json';

const defaultOptions = {
  fontSize: 45,
  thickness: 10,
  specular: 0x777777,
  // followRate: 0.03,
  followRadius: 280,
  opacity: 0.8,
  yPos: 0,
  animateDist: -20,
};

const loadingManager = new LoadingManager(null, null, console.error);
const loader = new FontLoader(loadingManager);

const renderText = (parent, options, font) => {
  // const listeners = [];

  const { specular, fontSize, thickness, followRadius, animateDist, yPos } =
    options;

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  parent.appendChild(renderer.domElement);

  const camera = new PerspectiveCamera(
    60,
    parent.clientWidth / parent.clientHeight,
    1,
    1000,
  );
  camera.position.z = 200;
  camera.position.y = -8;

  const scene = new Scene();

  const material = new MeshPhongMaterial({
    specular,
    transparent: true,
    opacity: 0,
  });

  /** @type {THREE.Group[]} */
  let anchors = [];

  const lightLookAt = new Vector3(11.45, 0, 0);

  const addLight = (color, x, y, z, intensity = 1) => {
    const newLight = new DirectionalLight(color, intensity);
    newLight.position.set(x, y, z);
    newLight.lookAt(lightLookAt);
    // newLight.lookAt(anchors[Math.floor(chars.length / 2)].position);
    scene.add(newLight);
  };

  addLight(0xffffff, 0, 1, 4, 0.3);

  // addLight(0xccb87a, 0, 4, 4, 1);
  // addLight(0xc9fff8, 0, 3, 1, 1);
  // addLight(0xff0000, -2, 1, 1);
  // addLight(0x0000ff, 0, -1, 0.5);
  // addLight(0xffff00, 2, -1, 2);
  // addLight(0x0000ff, 20, 0, 50);
  // addLight(0xffff00, -100, 0, 50);

  let mx = null,
    my = null;
  // let animateId;
  let render = () => {
    if (mx != null && my != null) {
      let ratioX = 0;
      let ratioY = 0;

      const { clientWidth: w, clientHeight: h } = parent;

      ratioX = mx / w - 0.5;
      ratioY = my / h - 0.5;

      const target = new Vector3(
        ratioX * followRadius,
        -ratioY * followRadius,
        2 * followRadius,
      );

      for (const anchor of anchors) anchor.lookAt(target);
    }

    renderer.render(scene, camera);

    // animateId = requestAnimationFrame(render);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = parent;

    renderer.setSize(w, h);
    camera.aspect = w / h;
    // Set FOV so letters fit in screen with some margin (20deg)
    // harcoding `250` for now, was `moveX`
    camera.fov =
      20 +
      2 *
        Math.atan(250 / (camera.aspect * 2 * camera.position.z)) *
        (180 / Math.PI);
    camera.updateProjectionMatrix();
    render();
  };
  window.addEventListener('resize', resize);

  const onMouseMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    render();
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('click', onMouseMove);

  let orientation;
  if ('DeviceOrientationEvent' in window) {
    orientation = listenToOrientation(
      () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('click', onMouseMove);
        mx = my = null;
      },
      (quaternion) => {
        for (let obj of anchors) {
          // TODO: necessary?
          if (obj.rotation.order !== 'YXZ') obj.rotation.reorder('YXZ');

          obj.quaternion.copy(quaternion);
        }

        renderer.render(scene, camera);
      },
    );
  }

  let anim, anim2;
  let animDelay;

  // causes a render
  resize();

  let currentText;

  return {
    setText(newText) {
      if (!newText) return;
      if (currentText === newText) return;

      currentText = newText;

      let moveX = 0;

      clearTimeout(animDelay);
      anim?.stop();
      // anim2?.stop();

      const oldAnchors = anchors;
      const anims2 = oldAnchors.map(() => new Animated.Value(0));

      anim2 = Animated.stagger(
        100,
        anims2.map((an) => Animated.spring(an, { toValue: 1 })),
      );

      anim2.start();

      anims2.forEach((anim, i) =>
        anim.addListener(({ value }) => {
          oldAnchors[i].position.z = value * animateDist + yPos;

          oldAnchors[i].children[0].material.opacity = 1 - value;

          render();

          if (value >= 1) scene.remove(oldAnchors[i]);
        }),
      );

      // let lastW2 = 0;
      const chars = newText.split('');
      const center = new Vector3();
      anchors = chars.map((char, i) => {
        const geometry = new TextGeometry(char, {
          font,
          size: fontSize,
          height: thickness,
        });

        const text = new Mesh(geometry, material.clone());
        const bbox = new Box3().setFromObject(text);
        bbox.getCenter(center);
        text.position.sub(center);
        text.position.y = -fontSize / 2;

        const anchor = new Group();

        const w2 = bbox.getSize(new Vector3()).x / 2;
        if (i !== 0) moveX += 10;
        moveX += w2;
        anchor.position.x = moveX;
        moveX += w2;

        anchor.position.y = animateDist + yPos;
        anchor.add(text);
        scene.add(anchor);

        return anchor;
      });
      for (const anchor of anchors) anchor.position.x -= moveX / 2;

      const anims = anchors.map(() => new Animated.Value(0));

      anim = Animated.stagger(
        100,
        anims.map((anim) => Animated.spring(anim, { toValue: 1 })),
      );

      anims.forEach((anim, i) =>
        anim.addListener(({ value }) => {
          anchors[i].position.y = (1 - value) * animateDist + yPos;

          anchors[i].children[0].material.opacity = value;
          render();
        }),
      );

      animDelay = setTimeout(() => {
        anim.start();
      }, 200);
    },

    dispose() {
      clearTimeout(animDelay);

      anim?.stop();
      anim2?.stop();

      renderer.dispose();
      renderer.domElement.remove();
      // cancelAnimationFrame(animateId);

      // Remove event listeners
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onMouseMove);
      window.removeEventListener('resize', resize);

      orientation?.dispose();
    },
  };
};

const BlockText = ({ options, text }) => {
  const containerRef = useRef();

  const blockText = useRef(null);

  useEffect(() => {
    blockText.current = renderText(
      containerRef.current,
      { ...defaultOptions, ...(options || {}) },
      loader.parse(fontJson),
    );

    return () => {
      blockText.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (!blockText.current) return;

    blockText.current.setText(text);
  }, [text]);

  return (
    // Use min width and height to prevent webGL crash when size is 0
    <>
      <div
        ref={containerRef}
        style={{
          pointerEvents: 'none',
          minHeight: 10,
          minWidth: 10,
          maxWidth: 1600,
          margin: '0 auto',
        }}
      />
      <h1 className="sr-only">{text}</h1>
    </>
  );
};

export default React.memo(BlockText);
