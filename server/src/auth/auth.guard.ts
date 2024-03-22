import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
 constructor(private reflector: Reflector) {}
 
 canActivate(context: ExecutionContext): boolean {
  const request = context.switchToHttp().getRequest();
  console.log("AuthGuard", request.headers);
  return true;
  //return request.headers?.authorization === 'valid_token';
 }
}