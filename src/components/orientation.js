import * as THREE from 'three';

export default (render, enable, objects) => {

  const scope = {};
  let once = true;

  scope.objects = objects;
  for (const obj of scope.objects) obj.rotation.reorder('YXZ');

  scope.enabled = false;

  scope.deviceOrientation = {};
  scope.screenOrientation = 0;

  const onDeviceOrientationChangeEvent = (event) => {

    if (event.alpha === null) return;
    
    scope.deviceOrientation = event;
    scope.update();

    if (once) {
      enable();
      scope.enabled = true;
      once = false;
    }

  };

  const onScreenOrientationChangeEvent = () => {

    scope.screenOrientation = window.orientation || 0;
    scope.update();

  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  const getQuaternion = ((() => {

    const zee = new THREE.Vector3(0, 0, 1);

    const euler = new THREE.Euler();

    const q0 = new THREE.Quaternion();

    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return (alpha, beta, gamma, orient) => {

      const quaternion = new THREE.Quaternion();

      euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation

      return quaternion;
    };

  })());

  scope.connect = () => {

    onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

  };

  scope.disconnect = () => {

    window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

    scope.enabled = false;

  };

  scope.update = () => {

    if (!scope.enabled) return;

    const alpha = scope.deviceOrientation.alpha ?
      (THREE.Math.degToRad(0 * scope.deviceOrientation.alpha * 0.2)) : 0; // Z
    const beta = scope.deviceOrientation.beta ?
      (THREE.Math.degToRad(90 + (scope.deviceOrientation.beta * 0.2))) : 0; // X'
    const gamma = scope.deviceOrientation.gamma ?
      (THREE.Math.degToRad(scope.deviceOrientation.gamma * 0.2)) : 0; // Y''
    const orient = scope.screenOrientation ?
      THREE.Math.degToRad(scope.screenOrientation) : 0; // O

    const quaternion = getQuaternion(alpha, beta, gamma, orient);
    for (let obj of scope.objects) obj.quaternion.copy(quaternion);

    render();

  };

  scope.dispose = () => {

    scope.disconnect();

  };

  scope.connect();

  return scope;

};
