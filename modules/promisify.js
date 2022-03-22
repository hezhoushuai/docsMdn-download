import debug from "debug";
const debugOutput = debug('_h:promisify')

export default function (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      try {
        fn.call(this, ...args, (err, ret) => {
          if (err) {
            reject(err);
          } else resolve(ret);
        });
      } catch (e) {
        reject(e);
      }
    });
  };
}
