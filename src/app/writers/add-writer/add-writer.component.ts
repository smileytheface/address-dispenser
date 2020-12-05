import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { throwIfEmpty } from 'rxjs/operators';

import { Writer } from '../../shared/models/writer.model';
import { WritersService } from '../writers.service';

@Component({
  selector: 'app-add-writer',
  templateUrl: './add-writer.component.html',
  styleUrls: ['./add-writer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // animation taken from https://indepth.dev/in-depth-guide-into-animations-in-angular/
  // author: William Tjondrosuharto
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms', style({ opacity: 0.6, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
  ],
})
export class AddWriterComponent implements OnInit, OnDestroy {
  colors = [
    { colorValue: '#BBDCFF', colorName: 'Blue' },
    { colorValue: '#E2F1FF', colorName: 'Light blue' },
    { colorValue: '#FFCFD5', colorName: 'Salmon' },
    { colorValue: '#FFECEF', colorName: 'Light Pink' },
  ];
  @ViewChild('addWriterForm') form: NgForm;
  writerAddedSuccessfully: boolean = false;
  lastSubmittedWriter: Writer;
  writerAddedSub: Subscription;

  constructor(public router: Router, private writersService: WritersService) {}

  ngOnInit(): void {
    this.writerAddedSub = this.writersService
      .getWriterAddedListener()
      .subscribe((writerAdded) => {
        if (this.lastSubmittedWriter.name === writerAdded.name) {
          this.successfullyAddedMessage();
        }
      });
  }

  onSubmit(form: NgForm) {
    console.log(form);
    let newWriter: Writer = {
      id: null,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      prefersText: form.value.prefersText ? form.value.prefersText : false,
      defaultAddressAmount: form.value.defaultAddressAmount,
      totalCheckedOut: 0,
      color: form.value.color
        ? form.value.color
        : this.colors[this.getRandomNumberBetween(0, this.colors.length - 1)]
            .colorValue,
    };

    this.writersService.addWriter(newWriter);
    this.lastSubmittedWriter = newWriter;
    this.form.resetForm();
  }

  onCancel() {
    this.router.navigate(['/writers']);
  }

  successfullyAddedMessage() {
    this.writerAddedSuccessfully = true;
    setTimeout(() => {
      this.writerAddedSuccessfully = false;
    }, 4000);
  }

  // Javascript By Grepper on Jul 23 2019
  getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnDestroy() {
    this.writerAddedSub.unsubscribe();
  }
}
