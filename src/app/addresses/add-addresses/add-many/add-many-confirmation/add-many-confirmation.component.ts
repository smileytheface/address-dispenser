import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-many-confirmation',
  templateUrl: './add-many-confirmation.component.html',
  styleUrls: ['./add-many-confirmation.component.scss'],
})
export class AddManyConfirmationComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
