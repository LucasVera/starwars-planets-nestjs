import { InvalidTokenException, MalformedAuthException, TokenNotFoundException } from "@/util/exceptions/auth.exception";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";


/**
 * Guard that validates an incoming bearer token authentication method
 * The token must be in a "Authorization" header, and must follow bearer token format:
 * Authorization: "Bearer {token}"
 * (TODO): use dummy_token to validate in development
 */
export class AuthGuard implements CanActivate {
  private readonly expectedTokenValue = 'dummy_token'

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    return this.validateRequest(request)
  }

  private validateRequest(request): boolean {
    const { authorization } = request.headers

    if (!authorization) throw new TokenNotFoundException()

    const bearerArr = authorization.split(' ')
    if (bearerArr.length !== 2) throw new MalformedAuthException()

    const [bearer, token] = bearerArr

    if (bearer !== 'Bearer') throw new MalformedAuthException()
    if (token !== this.expectedTokenValue) throw new InvalidTokenException()

    return true
  }
}
