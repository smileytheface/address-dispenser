import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Writer } from '../shared/models/writer.model';

@Injectable({ providedIn: 'root' })
export class WritersService {
  private writers: Writer[] = [];
  private writersUpdated = new Subject<Writer[]>();
  private writerAdded = new Subject<Writer>();

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

  getWriter(writerId: string) {
    return this.http.get<any>('http://localhost:3000/api/writers/' + writerId);
  }

  addWriter(writer: Writer) {
    let newWriter: Writer = writer;
    this.http
      .post<{ message: string; createdWriterId: string }>(
        'http://localhost:3000/api/writers',
        newWriter
      )
      .subscribe((responseData) => {
        const id = responseData.createdWriterId;
        newWriter.id = id;
        this.writers.push(newWriter);
        this.writersUpdated.next([...this.writers]);
        this.writerAdded.next(newWriter);
      });
  }

  deleteWriter(id: string) {
    this.http
      .delete<{ message: string }>('http://localhost:3000/api/writers/' + id)
      .subscribe(() => {
        const updatedWriters = this.writers.filter(
          (writer) => writer.id !== id
        );
        this.writers = updatedWriters;
        this.writersUpdated.next([...this.writers]);
      });
  }

  getWritersUpdatedListener() {
    return this.writersUpdated.asObservable();
  }

  getWriterAddedListener() {
    return this.writerAdded.asObservable();
  }
}
