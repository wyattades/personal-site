export default class AggregateListener {
  constructor() {
    this.listeners = [];
  }

  add(observer, name, cb, useCapture) {
    observer.addEventListener(name, cb, useCapture);

    this.listeners.push({
      observer,
      name,
      cb,
    });

    return () => {
      this.remove(observer, name, cb);
    };
  }

  remove(observer, name, cb) {
    if (cb) {
      this.listeners = this.listeners.filter((lis) => {
        if (lis.observer === observer && lis.name === name && lis.cb === cb) {
          lis.observer.removeEventListener(lis.name, lis.cb);
          return false;
        }
        return true;
      });
    } else if (name) {
      this.listeners = this.listeners.filter((lis) => {
        if (lis.observer === observer && lis.name === name) {
          lis.observer.removeEventListener(lis.name, lis.cb);
          return false;
        }
        return true;
      });
    } else if (observer) {
      this.listeners = this.listeners.filter((lis) => {
        if (lis.observer === observer) {
          lis.observer.removeEventListener(lis.name, lis.cb);
          return false;
        }
        return true;
      });
    } else {
      for (const lis of this.listeners) {
        lis.observer.removeEventListener(lis.name, lis.cb);
      }
      this.listeners = [];
    }
  }
}
