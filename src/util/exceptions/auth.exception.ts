import BaseException from "./base.exception";

export class MalformedAuthException extends BaseException {
  constructor() {
    super("Auth is malformed. It should be 'Bearer <token>'", 401)
  }
}

export class TokenNotFoundException extends BaseException {
  constructor() {
    super("Auth token not found. It should come in a 'Authorization' header as a 'Bearer <token>'", 401)
  }
}

export class InvalidTokenException extends BaseException {
  constructor() {
    super("Session expired or token is invalid.", 401)
  }
}
