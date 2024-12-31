import { HttpClient } from "@angular/common/http";
import { inject,Injectable } from "@angular/core";
import { Trade } from "../types/trade";
import { environment } from "../../environments/environment";
import { env } from "process";

@Injectable({
    providedIn:'root'
})
export class TradeDetailsService{
    http=inject (HttpClient);
    constructor(){}
}