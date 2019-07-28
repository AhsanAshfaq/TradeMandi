import { Sale } from '../../shared/models/sale';
import { SaleApiService } from '../../shared/services/sales.service';
import { SaleDetailApiService } from '../../shared/services/saleDetail.service';
import { ApiService as SupplierService } from '../../shared/services/suppliers.service';
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
  displayedColumns: string[] = ['_id', 'builtyNumber', 'truckNumber', 'truckRent', 'supplier', 'action'];

  constructor(private saleApi: SaleApiService, private supplierApi: SupplierService, private saleDetailApi: SaleDetailApiService) {
    this.saleApi.GetSales().subscribe(data => {
      this.SaleData = data;
      this.SaleData.forEach(element => {
        this.supplierApi.GetSupplier(element.supplier).subscribe((supplier) => {
          console.log(supplier);
          element.supplier = supplier.name;
        });
      });
      this.dataSource = new MatTableDataSource<Sale>(this.SaleData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }

  ngOnInit() {

  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  getSupplierName(id) {
    this.supplierApi.GetSupplier(id).subscribe((data) => {
      console.log(data.name);
      return data.name;
    });
  }

  deleteSale(index: number, e) {
    if (window.confirm('Are you sure, as this will delete all sale and detail information as well.')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.saleApi.GetSale(e._id).subscribe((sale) => {
        sale.saleDetails.forEach(element => {
          this.saleDetailApi.DeleteSaleDetail(element);
        });
      });
      this.saleApi.DeleteSale(e._id).subscribe();
    }
  }
}
