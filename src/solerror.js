class SolError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SolError';
  }
};

export default SolError;
