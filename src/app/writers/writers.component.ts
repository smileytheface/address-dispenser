import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Writer } from '../shared/models/writer.model';
import { DeleteConfirmationComponent } from '../shared/delete-confirmation/delete-confirmation.component';

import { WritersService } from './writers.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-writers',
  templateUrl: './writers.component.html',
  styleUrls: ['./writers.component.scss'],
})
export class WritersComponent implements OnInit, OnDestroy {
  writers: Writer[] = [];
  isLoading: boolean = false;
  writersSub: Subscription;

  constructor(
    public writersService: WritersService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Writers | Address Dispenser');
    this.writersService.getWriters();
    this.isLoading = true;
    this.writersSub = this.writersService
      .getWritersUpdatedListener()
      .subscribe((writers: Writer[]) => {
        this.writers = writers;
        this.isLoading = false;
      });
  }

  onAddWriter() {
    this.router.navigate(['add-writer'], { relativeTo: this.route });
  }

  onDelete(writer: Writer) {
    const dialogMessage =
      'Are you sure you would like to delete ' +
      writer.name +
      ' from your writers list?';

    let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: { messageTitle: dialogMessage },
    });

    dialogRef.afterClosed().subscribe((deletionConfirmed) => {
      if (deletionConfirmed === 'true') {
        this.writersService.deleteWriter(writer.id);
      }
    });
  }

  onEdit(id: string) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.writersSub.unsubscribe();
  }
}
