import { Component, OnInit } from '@angular/core';
import { Writer } from '../shared/models/writer.model';

@Component({
  selector: 'app-writers',
  templateUrl: './writers.component.html',
  styleUrls: ['./writers.component.scss'],
})
export class WritersComponent implements OnInit {
  writers: Writer[] = [
    {
      name: 'Mark Way',
      email: 'mway@mark.com',
      phone: '555-555-5555',
      prefersText: true,
      defaultAddressAmount: 6,
      totalCheckedOut: 6,
      color: '#E2F1FF',
    },
    {
      name: 'Iola Blackman',
      email: 'iblack@iola.com',
      phone: '555-555-5555',
      prefersText: true,
      defaultAddressAmount: 6,
      totalCheckedOut: 15,
      color: '#FFCFD5',
    },
    {
      name: 'Amalia Comprat',
      email: 'acomprat@comprat.com',
      phone: '555-123-4567',
      prefersText: false,
      defaultAddressAmount: 4,
      totalCheckedOut: 10,
      color: '#FFECEF',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
