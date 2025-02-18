import { Euler, Quaternion, Vector3 } from "three";

type DeviceOrientation = {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
};

type OrientationCallback = (quaternion: Quaternion) => void;

export class DeviceOrientationController {
  private enabled = false;
  private deviceOrientation: DeviceOrientation = {
    alpha: null,
    beta: null,
    gamma: null,
  };
  private screenOrientation = 0;
  private once = true;
  private readonly onEnable: () => void;
  private readonly onRender: OrientationCallback;
  private readonly getQuaternion: (
    alpha: number,
    beta: number,
    gamma: number,
    orient: number,
  ) => Quaternion;

  constructor(onEnable: () => void, onRender: OrientationCallback) {
    this.onEnable = onEnable;
    this.onRender = onRender;
    this.getQuaternion = this.createQuaternionCalculator();
    this.connect();
  }

  private createQuaternionCalculator() {
    const zee = new Vector3(0, 0, 1);
    const euler = new Euler();
    const q0 = new Quaternion();
    const q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return (alpha: number, beta: number, gamma: number, orient: number) => {
      const quaternion = new Quaternion();
      euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us
      quaternion.setFromEuler(euler); // orient the device
      quaternion.multiply(q1); // camera looks out the back of the device, not the top
      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
      return quaternion;
    };
  }

  private onDeviceOrientationChangeEvent = (event: DeviceOrientationEvent) => {
    if (event.alpha === null) return;

    if (this.once) {
      this.onEnable();
      this.enabled = true;
      this.once = false;
    }

    this.deviceOrientation = {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    };
    this.update();
  };

  private onScreenOrientationChangeEvent = () => {
    this.screenOrientation = window.orientation || 0;
    this.update();
  };

  private update() {
    if (!this.enabled) return;

    const degToRad = Math.PI / 180;
    const alpha = this.deviceOrientation.alpha
      ? degToRad * (0 * this.deviceOrientation.alpha * 0.2)
      : 0; // Z
    const beta = this.deviceOrientation.beta
      ? degToRad * (90 + this.deviceOrientation.beta * 0.2)
      : 0; // X'
    const gamma = this.deviceOrientation.gamma
      ? degToRad * (this.deviceOrientation.gamma * 0.2)
      : 0; // Y''
    const orient = this.screenOrientation
      ? degToRad * this.screenOrientation
      : 0; // O

    const quaternion = this.getQuaternion(alpha, beta, gamma, orient);
    this.onRender(quaternion);
  }

  public connect() {
    this.onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener(
      "orientationchange",
      this.onScreenOrientationChangeEvent,
      false,
    );
    window.addEventListener(
      "deviceorientation",
      this.onDeviceOrientationChangeEvent,
      false,
    );
  }

  public disconnect() {
    window.removeEventListener(
      "orientationchange",
      this.onScreenOrientationChangeEvent,
      false,
    );
    window.removeEventListener(
      "deviceorientation",
      this.onDeviceOrientationChangeEvent,
      false,
    );

    this.enabled = false;
  }
}
