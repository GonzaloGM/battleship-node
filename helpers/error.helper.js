function NotFoundError({ message, statusCode, errorCode, extra }) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = "NotFoundError";
  this.message = message || "Not Found";
  this.statusCode = statusCode || 404;
  this.errorCode = errorCode;
  this.extra = extra;
}

NotFoundError.prototype.__proto__ = Error.prototype;

function BadRequestError({ message, statusCode, errorCode, extra }) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = "BadRequestError";
  this.message = message || "Bad Request";
  this.statusCode = statusCode || 400;
  this.errorCode = errorCode;
  this.extra = extra;
}

BadRequestError.prototype.__proto__ = Error.prototype;

function ForbiddenError({ message, statusCode, errorCode, extra }) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = "ForbiddenError";
  this.message = message || "Forbidden";
  this.statusCode = statusCode || 403;
  this.errorCode = errorCode;
  this.extra = extra;
}

ForbiddenError.prototype.__proto__ = Error.prototype;

function UnauthorizedError({ message, statusCode, errorCode, extra }) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = "UnauthorizedError";
  this.message = message || "Unauthorized";
  this.statusCode = statusCode || 403;
  this.errorCode = errorCode;
  this.extra = extra;
}

UnauthorizedError.prototype.__proto__ = Error.prototype;

function BusinessError({ message, statusCode, errorCode, extra }) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = "BusinessError";
  this.message = message || "Business Error";
  this.statusCode = statusCode || 400;
  this.errorCode = errorCode;
  this.extra = extra;
}

BusinessError.prototype.__proto__ = Error.prototype;

module.exports = {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  BusinessError
};
