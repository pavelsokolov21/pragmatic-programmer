export const pipe = (fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

export const gt = (a) => (b) => a > b;

export const lt = (a) => (b) => b > a;

export const head = (arr) => arr[0];

export const last = (arr) => arr[arr.length - 1];

export const anyPass = (fns) => (value) =>
  fns.reduce((acc, fn) => (acc ? acc : fn(value)), false);

export const either = (cond) => (t) => (f) => (value) =>
  cond(value) ? t(value) : f(value);

export const throwError = (value) => {
  throw new Error(value);
};

export const decorateFnToReturnReasonPair = (fn, reason) => (value) => {
  const isInvalid = fn(value);

  return [!isInvalid, isInvalid ? reason : value];
};

export const callOrSkip = (fns) => (value) =>
  fns.reduce(
    (result, fn) => {
      return head(result) ? fn(value) : result;
    },
    [true, null]
  );
