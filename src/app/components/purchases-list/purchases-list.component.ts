import { Purchase } from '../../shared/models/purchase';
import { PurchaseApiService } from '../../shared/services/purchases.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-purchases-list',
  templateUrl: './purchases-list.component.html',
  styleUrls: ['./purchases-list.component.css']
})

export class PurchasesListComponent implements OnInit {
  PurchaseData: any = [];
  dataSource: MatTableDataSource<Purchase>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['_id', 'builtyNumber', 'quantity', 'amount', 'action'];

  constructor(private purchaseApi: PurchaseApiService) {
    this.purchaseApi.GetPurchases().subscribe(data => {
      this.PurchaseData = data;
      console.log(this.PurchaseData);
      this.dataSource = new MatTableDataSource<Purchase>(this.PurchaseData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }

  ngOnInit() { }

  deletePurchase(index: number, e) {
    if (window.confirm('Are you sure')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.purchaseApi.DeletePurchase(e._id).subscribe();
    }
  }
}
