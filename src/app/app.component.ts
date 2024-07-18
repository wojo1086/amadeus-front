import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { BehaviorSubject, combineLatest, concat, map, Observable } from 'rxjs';
import { StockService } from './stock/stock.service';
import { HeaderCell, Sort, Stock, StockTable } from './stock/stock.model';
import { TableHeaderCellComponent } from './shared/components/table-header-cell/table-header-cell.component';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        AsyncPipe,
        CurrencyPipe,
        DecimalPipe,
        NgClass,
        TableHeaderCellComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})
export class AppComponent {
    private stockService = inject(StockService);

    // Table columns
    columns: HeaderCell[] = [
        {
            key: 'symbol',
            value: 'Symbol',
            sort: Sort.DESC
        },
        {
            key: 'name',
            value: 'Company Name',
            sort: null
        },
        {
            key: 'currentPrice',
            value: 'Price',
            sort: null
        },
        {
            key: 'change',
            value: 'Change',
            sort: null
        },
        {
            key: 'changePercent',
            value: 'Chg %',
            sort: null
        }
    ];

    // BehaviorSubject to hold the current sort column
    private sort$ = new BehaviorSubject<HeaderCell>(this.columns[0]);

    // Observable to hold the stock data. It first gets an initial list of stocks from the BE and then switches to a stream of updated stocks.
    // The stocks are then mapped to a format that can be displayed in the table.
    // The observable is then combined with the sort$ observable to sort the data based on the selected column.
    stocks$: Observable<StockTable[]> = combineLatest([
        concat(
            this.stockService.getStocks(),
            this.stockService.subStocks()
        ).pipe(
            map(this.mapStocksForTable)
        ),
        this.sort$
    ]).pipe(
        map(this.sortStocksForTable)
    );

    /**
     * Sorts the table based on the selected column
     * @param column
     * @type HeaderCell
     */
    sort(column: HeaderCell) {
        column.sort = column.sort === null ? Sort.DESC : column.sort === Sort.DESC ? Sort.ASC : null;
        this.resetSort(column);
        this.sort$.next(column);
    }

    /**
     * Resets the sort for all columns except the selected column
     * @param column
     * @type HeaderCell
     * @private
     */
    private resetSort(column?: HeaderCell) {
        this.columns.forEach(col => {
            if (col !== column) {
                col.sort = null;
            }
        });
    }

    /**
     * Maps the stock data to a format that can be displayed in the table
     * @param stocks
     * @type Stock[]
     * @returns StockTable[]
     * @private
     */
    private mapStocksForTable(stocks: Stock[]): StockTable[] {
        return (stocks || []).map((stock: any) => {
            return {
                symbol: stock.symbol,
                name: stock.name,
                currentPrice: stock.currentPrice,
                change: stock.currentPrice - stock.closingPrice,
                changePercent: (stock.currentPrice - stock.closingPrice) / stock.closingPrice * 100,
                url: stock.url
            };
        })
    }

    /**
     * Sorts the stocks based on the selected column
     * @param data
     * @type [StockTable[], HeaderCell]
     * @returns StockTable[]
     * @private
     */
    private sortStocksForTable(data: [StockTable[], HeaderCell]): StockTable[] {
        const stocks = data[0];
        const headerCell = data[1];
        return stocks.sort((a, b) => {
            const prop = headerCell.key as keyof StockTable;
            if (typeof a[prop] === 'number') {
                const aVal = a[prop] as number;
                const bVal = b[prop] as number;
                return headerCell.sort === Sort.DESC ? aVal - bVal : bVal - aVal;
            } else {
                const aVal = a[prop] as string;
                const bVal = b[prop] as string;
                return headerCell.sort === Sort.DESC ?
                    aVal.localeCompare(bVal) :
                    bVal.localeCompare(aVal);
            }
        });
    }
}

