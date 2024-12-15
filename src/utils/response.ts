export const createResponse = <T>(data: T, message: string = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

export const createErrorResponse = (message: string, code: number = 400) => {
  return {
    success: false,
    message,
    code
  };
};
