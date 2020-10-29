import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-add-addresses',
  templateUrl: './add-addresses.component.html',
  styleUrls: ['./add-addresses.component.scss'],
})
export class AddAddressesComponent implements OnInit {
  addMany: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    if (
      this.route.snapshot.firstChild.url[0].path &&
      this.route.snapshot.firstChild.url[0].path === 'add-many'
    ) {
      this.addMany = true;
    } else {
      this.addMany = false;
    }
  }

  onAddManyToggleChange() {
    if (!this.addMany) {
      this.router.navigate(['add-one'], { relativeTo: this.route });
    } else {
      this.router.navigate(['add-many'], { relativeTo: this.route });
    }
  }
}
