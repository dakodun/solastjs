class EngineError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EngineError';
  }
};

export default EngineError;
