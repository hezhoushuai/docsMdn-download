export default function (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      try {
        fn.call(this, ...args, (err, ret) => {
          if (err) {
            console.log(args);
            reject(err);
          } else resolve(ret);
        });
      } catch (e) {
        reject(e);
      }
    });
  };
}
