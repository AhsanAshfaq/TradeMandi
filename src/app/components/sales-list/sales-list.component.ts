import { Sale } from '../../shared/models/sale';
import { SaleApiService } from '../../shared/services/sales.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})

export class SalesListComponent implements OnInit {
  SaleData: any = [];
  dataSource: MatTableDataSource<Sale>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['_id', 'builtyNumber', 'quantity', 'amount', 'action'];

  constructor(private saleApi: SaleApiService) {
    this.saleApi.GetSales().subscribe(data => {
      this.SaleData = data;
      console.log(this.SaleData);
      this.dataSource = new MatTableDataSource<Sale>(this.SaleData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }

  ngOnInit() { }

  deleteSale(index: number, e) {
    if (window.confirm('Are you sure')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.saleApi.DeleteSale(e._id).subscribe();
    }
  }
}
