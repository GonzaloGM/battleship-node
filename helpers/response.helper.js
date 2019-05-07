// TODO: change

const messages = {
  ID_REQUIRED: `ID is required`,
  MISSING_FIELDS: `Missing or invalid parameters`,
  URL_NOT_FOUND: `Resource not found`,
  UNAUTHORIZED: `Unauthorized`
};

const respond = (res, response) => {
  res.send(response);
};

exports.respondData = (res, data) => {
  const response = {};
  response.status = true;
  response.data = data;
  res.status(200);

  respond(res, response);
};

exports.respondDataSDK = (res, data, msg) => {
  const response = {};
  response.status = true;
  response.data = data;
  response.message = msg;
  res.status(200);

  respond(res, response);
};

exports.respondMessage = (res, message) => {
  const response = {};
  response.status = true;
  response.message = message;
  res.status(200);

  respond(res, response);
};

exports.respondBadRequest = (res, message) => {
  const response = {};
  response.status = false;
  response.message = message || messages.BAD_REQUEST;
  res.status(400);

  respond(res, response);
};

exports.respondUnauthorized = (res, message) => {
  const response = {};
  response.status = false;
  response.message = message || messages.UNAUTHORIZED;
  res.status(401);

  respond(res, response);
};

exports.respondForbidden = res => {
  const response = {};
  response.status = false;
  response.message = messages.FORBIDDEN;
  res.status(403);

  respond(res, response);
};

exports.respondNotFound = ({ res, message }) => {
  const response = {};
  response.status = false;
  response.message = message || messages.NOT_FOUND;
  res.status(404);

  respond(res, response);
};

exports.notFound = (req, res, next) => {
  const response = {};
  response.status = false;
  response.message = messages.URL_NOT_FOUND;
  res.status(404);

  respond(res, response);
};

exports.error = (err, req, res, next) => {
  console.log(err);
  const response = {};
  response.status = false;
  response.message = err.message;
  response.errorCode = err.errorCode;
  res.status(err.statusCode || 500);
  if (err.extra) {
    console.log(`Error extras`, err.extra);
  }

  respond(res, response);
};
