import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Writer } from '../shared/models/writer.model';
import { DeleteWriterConfirmationComponent } from './delete-writer-confirmation/delete-writer-confirmation.component';

import { WritersService } from './writers.service';

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
    private dialog: MatDialog
  ) {}

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

  onAddWriter() {
    this.router.navigate(['add-writer'], { relativeTo: this.route });
  }

  onDelete(writer: Writer) {
    let dialogRef = this.dialog.open(DeleteWriterConfirmationComponent, {
      data: writer,
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
