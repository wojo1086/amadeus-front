import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { HeaderCell, Sort } from '../../../stock/stock.model';

@Component({
    selector: 'app-table-header-cell',
    standalone: true,
    imports: [
        NgClass
    ],
    templateUrl: './table-header-cell.component.html',
    styleUrl: './table-header-cell.component.sass',
})
export class TableHeaderCellComponent {
    @Input() column!: HeaderCell;
    Sort = Sort;
}
