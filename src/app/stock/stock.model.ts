// Object model for stock data from the API
export interface Stock {
    id: string;
    symbol: string;
    name: string;
    currentPrice: number;
    closingPrice: number;
    url: string;
}

// Object model for stock data to be displayed in the table
export interface StockTable {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    url: string;
}

// Object model for the header cells in the table
export interface HeaderCell {
    key: string;
    value: string;
    sort: null | 'asc' | 'desc';
}

// Enum for sorting direction
export enum Sort {
    ASC = 'asc',
    DESC = 'desc'
}
