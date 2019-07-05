import { User } from '../../shared/models/user';
import { ApiService } from '../../shared/services/users.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})

export class UsersListComponent implements OnInit {
  UserData: any = [];
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['_id', 'user_name', 'user_email', 'user_phone', 'action'];

  constructor(private userApi: ApiService) {
    this.userApi.GetUsers().subscribe(data => {
      this.UserData = data;
      console.log(this.UserData);
      this.dataSource = new MatTableDataSource<User>(this.UserData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }

  ngOnInit() { }

  deleteUser(index: number, e) {
    if (window.confirm('Are you sure')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.userApi.DeleteUser(e._id).subscribe();
    }
  }
}
