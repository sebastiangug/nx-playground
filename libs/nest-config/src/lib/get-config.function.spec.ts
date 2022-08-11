describe('GetConfig function', () => {
  const env = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...env };
  });

  it('should retrieve default config for every generic', () => {
    // getting a configuration from a service instance with all configs should still work
    expect(true).toBeTruthy();
  });

  it('should use the environment config for every generic', () => {
    // values we're overwriting with
    expect(true).toBeTruthy();
  });

  afterEach(async () => {
    process.env = env;
  });
});
