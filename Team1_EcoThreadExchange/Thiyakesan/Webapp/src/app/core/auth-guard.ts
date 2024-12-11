import { inject } from "@angular/core";
import { CanActivateFn,Router } from "@angular/router";
import { AuthService} from "../services/auth.service";

export const authGaurd:CanActivateFn=(route,state)=>{
    const authService=inject(AuthService);
    const router=inject(Router);
    if(authService.isLoggedIn){
        return true;
    }else{
        router.navigateByUrl('/login');
        return false;
    }
}