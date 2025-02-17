import { Vector3, Quaternion, Euler } from 'three';

export default function listenToOrientation(onEnable, onRender) {
  const scope = {};
  let once = true;

  scope.enabled = false;

  scope.deviceOrientation = {};
  scope.screenOrientation = 0;

  const onDeviceOrientationChangeEvent = (event) => {
    if (event.alpha === null) return;

    if (once) {
      onEnable();
      scope.enabled = true;
      once = false;
    }

    Object.assign(scope.deviceOrientation, {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });
    scope.update();
  };

  const onScreenOrientationChangeEvent = () => {
    scope.screenOrientation = window.orientation || 0;
    scope.update();
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  const getQuaternion = (() => {
    const zee = new Vector3(0, 0, 1);

    const euler = new Euler();

    const q0 = new Quaternion();

    const q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return (alpha, beta, gamma, orient) => {
      const quaternion = new Quaternion();

      euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation

      return quaternion;
    };
  })();

  scope.connect = () => {
    onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener(
      'orientationchange',
      onScreenOrientationChangeEvent,
      false,
    );
    window.addEventListener(
      'deviceorientation',
      onDeviceOrientationChangeEvent,
      false,
    );
  };

  scope.disconnect = () => {
    window.removeEventListener(
      'orientationchange',
      onScreenOrientationChangeEvent,
      false,
    );
    window.removeEventListener(
      'deviceorientation',
      onDeviceOrientationChangeEvent,
      false,
    );

    scope.enabled = false;
  };

  const degToRad = Math.PI / 180;

  scope.update = () => {
    if (!scope.enabled) return;

    const alpha = scope.deviceOrientation.alpha
      ? degToRad * (0 * scope.deviceOrientation.alpha * 0.2)
      : 0; // Z
    const beta = scope.deviceOrientation.beta
      ? degToRad * (90 + scope.deviceOrientation.beta * 0.2)
      : 0; // X'
    const gamma = scope.deviceOrientation.gamma
      ? degToRad * (scope.deviceOrientation.gamma * 0.2)
      : 0; // Y''
    const orient = scope.screenOrientation
      ? degToRad * scope.screenOrientation
      : 0; // O

    const quaternion = getQuaternion(alpha, beta, gamma, orient);

    onRender(quaternion);
  };

  scope.dispose = () => {
    scope.disconnect();
  };

  scope.connect();

  return scope;
}
