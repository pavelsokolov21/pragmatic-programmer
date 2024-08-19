import {
  pipe,
  gt,
  lt,
  head,
  last,
  either,
  throwError,
  decorateFnToReturnReasonPair,
  anyPass,
  callOrSkip,
} from "../utils/common";

const isLT150 = lt(150);
const isGT18 = gt(18);
const isNaNWithReason = decorateFnToReturnReasonPair(isNaN, "Number is NaN");
const isOutOfRangeWithReason = decorateFnToReturnReasonPair(
  anyPass([isLT150, isGT18]),
  "Number is out of range"
);
const validate = callOrSkip([isNaNWithReason, isOutOfRangeWithReason]);

export const parseIntInRange = pipe([
  Number,
  validate,
  either(head)(last)(pipe([last, throwError])),
]);
