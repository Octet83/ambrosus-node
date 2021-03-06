/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
  PermissionError
} from '../errors/errors';

export default (logger) => (err, req, res, next) => {
  const requestData = {
    httpVersion: req.httpVersion,
    headers: req.headers,
    url: req.url,
    method: req.method,
    body: req.body
  };
  let status;

  if (err instanceof ValidationError) {
    status = 400;
  } else if (err instanceof AuthenticationError) {
    status = 401;
  } else if (err instanceof PermissionError) {
    status = 403;
  } else if (err instanceof NotFoundError) {
    status = 404;
  } else {
    status = 500;
  }
  if (status !== 500) {
    logger.info(`${status}: ${err}\nRequest info: ${JSON.stringify(requestData, null, 4)}`);
  } else {
    logger.error(`500: ${err}\nRequest info: ${JSON.stringify(requestData, null, 4)}`);
  }
  res.status(status).send({reason: err.message});

  next();
};
