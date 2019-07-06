import { Supplier } from '../../shared/models/supplier';
import { ApiService } from '../../shared/services/suppliers.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})

export class SuppliersListComponent implements OnInit {
  SupplierData: any = [];
  dataSource: MatTableDataSource<Supplier>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['_id', 'name', 'phone', 'city', 'action'];

  constructor(private supplierApi: ApiService) {
    this.supplierApi.GetSuppliers().subscribe(data => {
      this.SupplierData = data;
      console.log(this.SupplierData);
      this.dataSource = new MatTableDataSource<Supplier>(this.SupplierData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }

  ngOnInit() { }

  deleteSupplier(index: number, e) {
    if (window.confirm('Are you sure')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.supplierApi.DeleteSupplier(e._id).subscribe();
    }
  }
}
