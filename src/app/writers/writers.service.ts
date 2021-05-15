import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Writer } from '../shared/models/writer.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/writers';

@Injectable({ providedIn: 'root' })
export class WritersService {
  private writers: Writer[] = [];
  private writersUpdated = new Subject<Writer[]>();
  private writerAdded = new Subject<Writer>();

  constructor(private http: HttpClient) {}

  getWriters() {
    this.http
      .get<{ message: string; writers: any }>(BACKEND_URL)
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
      });
  }

  getWriter(writerId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + writerId);
  }

  addWriter(writer: Writer) {
    let newWriter: Writer = writer;
    this.http
      .post<{ message: string; createdWriterId: string }>(
        BACKEND_URL,
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

  updateWriter(id: string, updatedWriter: Writer) {
    const newWriter = updatedWriter;
    this.http
      .put<{ message: string }>(BACKEND_URL + '/' + id, newWriter)
      .subscribe((responseMessage) => {
        const updatedWriters = [...this.writers];
        const oldWriterIndex = updatedWriters.findIndex(
          (writer) => writer.id === newWriter.id
        );
        updatedWriters[oldWriterIndex] = newWriter;
        this.writers = updatedWriters;
        this.writersUpdated.next([...this.writers]);
      });
  }

  deleteWriter(id: string) {
    this.http
      .delete<{ message: string }>(BACKEND_URL + '/' + id)
      .subscribe(() => {
        const updatedWriters = this.writers.filter(
          (writer) => writer.id !== id
        );
        this.writers = updatedWriters;
        this.writersUpdated.next([...this.writers]);
      });
  }

  getWriterName(id: string) {
    return this.writers.find((writer) => writer.id === id).name;
  }

  getWritersUpdatedListener() {
    return this.writersUpdated.asObservable();
  }

  getWriterAddedListener() {
    return this.writerAdded.asObservable();
  }
}
