export class FSM {
  constructor(initialState, states) {
    this.initialState = initialState;
    this.states = states;
    this.currentState = initialState;
    this.subscribers = this.#initializeSubscribers(states);
  }

  subscribe(fn, state) {
    if (!state) {
      console.error("Cannot subscribe without state");

      return;
    }

    if (!this.subscribers.has(state)) {
      console.error(`'${state}' does not exist on state machine`);

      return;
    }

    const subscribersByState = this.subscribers.get(state);

    subscribersByState.add(fn);

    return () => {
      subscribersByState.delete(fn);
    };
  }

  #initializeSubscribers(states) {
    return Object.keys(states).reduce((acc, key) => {
      acc.set(key, new Set());

      return acc;
    }, new Map());
  }

  #notify(currentState) {
    const subscribers = this.subscribers.get(currentState);

    for (const subscriber of subscribers) {
      subscriber(this.currentState);
    }
  }

  notifyImmediately() {
    this.#notify(this.currentState);
  }

  send(state) {
    if (state === this.currentState) {
      console.warn(
        `Current action and incoming action are same. Incoming action: ${state}`
      );

      return;
    }

    const nextState = this.states[this.currentState][state];

    if (!nextState) {
      throw new Error(
        `Unexpected action: '${state}' for the state '${this.currentState}'`
      );
    }

    this.currentState = nextState;

    this.#notify(nextState);
  }

  getState() {
    return this.currentState;
  }
}

const PASSWORD_VALIDATION_STATES = {
  IDLE: "IDLE",
  INVALID: "INVALID",
  VALID: "VALID",
};

const PASSWORD_VALIDATION_ACTIONS = {
  MARK_VALID: "MARK_VALID",
  MARK_INVALID: "MARK_INVALID",
  MAKE_IDLE: "MAKE_IDLE",
};

const passwordFMS = new FSM(PASSWORD_VALIDATION_STATES.IDLE, {
  [PASSWORD_VALIDATION_STATES.IDLE]: {
    [PASSWORD_VALIDATION_ACTIONS.MARK_INVALID]:
      PASSWORD_VALIDATION_STATES.INVALID,
    [PASSWORD_VALIDATION_ACTIONS.MARK_VALID]: PASSWORD_VALIDATION_STATES.VALID,
  },
  [PASSWORD_VALIDATION_STATES.INVALID]: {
    [PASSWORD_VALIDATION_ACTIONS.MAKE_IDLE]: PASSWORD_VALIDATION_STATES.IDLE,
    [PASSWORD_VALIDATION_ACTIONS.MARK_VALID]: PASSWORD_VALIDATION_STATES.VALID,
    [PASSWORD_VALIDATION_ACTIONS.MARK_INVALID]:
      PASSWORD_VALIDATION_STATES.INVALID,
  },
  [PASSWORD_VALIDATION_STATES.VALID]: {
    [PASSWORD_VALIDATION_ACTIONS.MAKE_IDLE]: PASSWORD_VALIDATION_STATES.IDLE,
    [PASSWORD_VALIDATION_ACTIONS.MARK_INVALID]:
      PASSWORD_VALIDATION_STATES.INVALID,
  },
});

const sendIdleMsg = () => {
  process.stdout.write("Введите пароль, соответствующий требованиям: ");
};

const sendValidMsg = () => {
  process.stdout.write("Пароль принят!");

  process.exit();
};

const sendInvalidMsg = () => {
  console.log("Пароль не соответствует требованиям");
  process.stdout.write("Введите пароль еще раз: ");
};

const validatePassword = (text) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[A-Za-z\W_]{12,}$/.test(text);

passwordFMS.subscribe(sendIdleMsg, PASSWORD_VALIDATION_STATES.IDLE);
passwordFMS.subscribe(sendValidMsg, PASSWORD_VALIDATION_STATES.VALID);
passwordFMS.subscribe(sendInvalidMsg, PASSWORD_VALIDATION_STATES.INVALID);

const start = async () => {
  passwordFMS.notifyImmediately();

  for await (const line of console) {
    const isPasswordValid = validatePassword(line);
    const action = isPasswordValid
      ? PASSWORD_VALIDATION_ACTIONS.MARK_VALID
      : PASSWORD_VALIDATION_ACTIONS.MARK_INVALID;

    passwordFMS.send(action);
  }
};

start();
