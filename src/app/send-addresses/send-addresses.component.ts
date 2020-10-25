import { Component, OnInit } from '@angular/core';

import { Writer } from '../shared/models/writer.model';

@Component({
  selector: 'app-send-addresses',
  templateUrl: './send-addresses.component.html',
  styleUrls: ['./send-addresses.component.scss'],
})
export class SendAddressesComponent implements OnInit {
  writers: Writer[] = [
    {
      name: 'Mark Way',
      email: '',
      phone: '',
      prefersText: true,
      defaultAddressAmount: 6,
      totalCheckedOut: 6,
      color: '#E2F1FF',
    },
    {
      name: 'Iola Blackman',
      email: '',
      phone: '',
      prefersText: true,
      defaultAddressAmount: 6,
      totalCheckedOut: 15,
      color: '#FFCFD5',
    },
    {
      name: 'Amalia Comprat',
      email: '',
      phone: '',
      prefersText: true,
      defaultAddressAmount: 4,
      totalCheckedOut: 10,
      color: '#FFECEF',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
