interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors?: ValidationError[];
}

class ErrorHandler extends Error {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: ValidationError[];

  constructor(
    statusCode: number,
    success: boolean,
    message: string,
    errors?: ValidationError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.errors = errors;
  }

  getResponse(): ErrorResponse {
    const response: ErrorResponse = {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
    };
    if (this.errors && this.errors.length > 0) {
      response.errors = this.errors;
    }
    return response;
  }

  static badRequest(message: string, errors?: ValidationError[]) {
    return new ErrorHandler(400, false, message, errors);
  }

  static unAuthorized(message: string) {
    return new ErrorHandler(401, false, message);
  }

  static notFound(message: string) {
    return new ErrorHandler(404, false, message);
  }

  static internalServerError(message: string = "Internal server error") {
    return new ErrorHandler(500, false, message);
  }

  static conflict(message: string) {
    return new ErrorHandler(409, false, message);
  }

  static validationError(zodError: any) {
    const parsedErrors: ValidationError[] = (zodError?.issues || []).map(
      (error: any) => {
        const field = error.path?.join(".") || "unknown";
        const message = error.message || "Invalid input";

        return { field, message };
      }
    );

    return new ErrorHandler(
      400,
      false,
      "Validation failed. Please check the errors below.",
      parsedErrors
    );
  }
}

export default ErrorHandler;
