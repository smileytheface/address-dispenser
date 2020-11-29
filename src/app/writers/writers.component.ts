import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Writer } from '../shared/models/writer.model';

import { WritersService } from './writers.service';

@Component({
  selector: 'app-writers',
  templateUrl: './writers.component.html',
  styleUrls: ['./writers.component.scss'],
})
export class WritersComponent implements OnInit {
  writers: Writer[] = [];
  isLoading: boolean = false;
  writersSub: Subscription;

  constructor(public writersService: WritersService) {}

  ngOnInit(): void {
    this.writersService.getWriters();
    this.isLoading = true;
    this.writersSub = this.writersService
      .getWritersUpdatedListener()
      .subscribe((writers: Writer[]) => {
        this.writers = writers;
        this.isLoading = false;
      });
  }
}
