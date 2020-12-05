import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-writer-confirmation',
  templateUrl: './delete-writer-confirmation.component.html',
  styleUrls: ['./delete-writer-confirmation.component.scss'],
})
export class DeleteWriterConfirmationComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
