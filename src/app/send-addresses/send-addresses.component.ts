import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Writer } from '../shared/models/writer.model';

@Component({
  selector: 'app-send-addresses',
  templateUrl: './send-addresses.component.html',
  styleUrls: ['./send-addresses.component.scss'],
})
export class SendAddressesComponent implements OnInit {
  writers: Writer[] = [
    {
      id: null,
      name: 'Mark Way',
      email: '',
      phone: '',
      prefersText: true,
      defaultAddressAmount: 6,
      totalCheckedOut: 6,
      color: '#E2F1FF',
    },
    {
      id: null,
      name: 'Iola Blackman',
      email: '',
      phone: '',
      prefersText: true,
      defaultAddressAmount: 6,
      totalCheckedOut: 15,
      color: '#FFCFD5',
    },
    {
      id: null,
      name: 'Amalia Comprat',
      email: '',
      phone: '',
      prefersText: true,
      defaultAddressAmount: 4,
      totalCheckedOut: 10,
      color: '#FFECEF',
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onCustomSend() {
    this.router.navigate(['custom-send'], { relativeTo: this.route });
  }

  onAddWriter() {
    this.router.navigate(['/writers/add-writer']);
  }
}
