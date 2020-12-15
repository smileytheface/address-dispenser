import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Writer } from 'src/app/shared/models/writer.model';
import { WritersService } from 'src/app/writers/writers.service';

@Component({
  selector: 'app-address-assign-dialog',
  templateUrl: './address-assign-dialog.component.html',
  styleUrls: ['./address-assign-dialog.component.scss'],
})
export class AddressAssignDialogComponent implements OnInit, OnDestroy {
  writers: Writer[] = [];
  writersSub: Subscription;
  loading: boolean = false;
  selectedWriterId: string = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private writersService: WritersService
  ) {}

  ngOnInit(): void {
    this.writersService.getWriters();
    this.loading = true;
    this.writersSub = this.writersService
      .getWritersUpdatedListener()
      .subscribe((writers) => {
        this.writers = writers;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.writersSub.unsubscribe();
  }
}
