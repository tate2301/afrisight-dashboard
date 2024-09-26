const getMessage = (err: any) => {
  return err.response && err.response && err.response.message
    ? err.response.message
    : err.message;
};

export { getMessage };
