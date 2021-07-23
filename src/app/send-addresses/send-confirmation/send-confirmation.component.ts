import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-send-confirmation',
  templateUrl: './send-confirmation.component.html',
  styleUrls: ['./send-confirmation.component.scss'],
})
export class SendConfirmationComponent implements OnInit {
  //data object needs to be formatted:
  // {
  //   text data or email data to preview the message
  //   messageData: TextData || EmailData,
  //   name of the writer to display
  //   writerName: string,
  //   whether this is being called from custom send or from quick send
  //   customSend: boolean
  // }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
