import { NotFoundException } from "@/util/exceptions/notFound.exception";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class ValidIdParamGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    return this.validateRequest(request)
  }

  validateRequest(request): boolean {
    const { params } = request
    if (!params || !params.id) throw new NotFoundException()

    const { id } = params
    const numeric = Number(id)
    if (Number.isNaN(numeric) || typeof numeric !== 'number') throw new NotFoundException()

    return true
  }
}