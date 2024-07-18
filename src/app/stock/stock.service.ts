import { inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Stock } from './stock.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StockService {
    private socket = inject(Socket);
    private http = inject(HttpClient);

    /**
     * Get all stocks
     * @returns Observable<Stock[]>
     */
    getStocks(): Observable<Stock[]> {
        return this.http.get<Stock[]>(`${environment.api}/stocks`);
    }

    /**
     * Subscribe to stock updates
     * @returns Observable<Stock[]>
     */
    subStocks(): Observable<Stock[]> {
        return this.socket.fromEvent('findAllStocks');
    }

}
