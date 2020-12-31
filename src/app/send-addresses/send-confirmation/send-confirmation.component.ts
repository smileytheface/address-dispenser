import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-send-confirmation',
  templateUrl: './send-confirmation.component.html',
  styleUrls: ['./send-confirmation.component.scss'],
})
export class SendConfirmationComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
