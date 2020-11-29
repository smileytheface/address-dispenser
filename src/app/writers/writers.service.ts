import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Writer } from '../shared/models/writer.model';

@Injectable({ providedIn: 'root' })
export class WritersService {
  private writers: Writer[];
  private writersUpdated = new Subject<Writer[]>();

  constructor(private http: HttpClient) {}

  getWriters() {
    this.http
      .get<{ message: string; writers: any }>(
        'http://localhost:3000/api/writers'
      )
      .pipe(
        map((writerData) => {
          return writerData.writers.map((writer) => {
            return {
              id: writer._id,
              name: writer.name,
              email: writer.email,
              phone: writer.phone,
              prefersText: writer.prefersText,
              defaultAddressAmount: writer.defaultAddressAmount,
              totalCheckedOut: writer.totalCheckedOut,
              color: writer.color,
            };
          });
        })
      )
      .subscribe((transformedWriters) => {
        this.writers = transformedWriters;
        this.writersUpdated.next([...this.writers]);
        console.log(this.writers);
      });
  }

  getWritersUpdatedListener() {
    return this.writersUpdated.asObservable();
  }
}
