import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private configService: ConfigService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const providedKey = request.headers['x-api-key'] as string;
        const validKey = this.configService.get<string>('apiKey');

        if(!providedKey || providedKey !== validKey) {
            throw new UnauthorizedException('Invalid or missing API key');
        }
        return true;
    }
}