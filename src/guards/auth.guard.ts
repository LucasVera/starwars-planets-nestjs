import { InvalidTokenException, MalformedAuthException, TokenNotFoundException } from "@/util/exceptions/auth.exception";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

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
