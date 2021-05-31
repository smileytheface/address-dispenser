import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgForm, NgModel, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { throwIfEmpty } from 'rxjs/operators';

import { Writer } from '../../shared/models/writer.model';
import { WritersService } from '../writers.service';

@Component({
  selector: 'app-add-writer',
  templateUrl: './add-writer.component.html',
  styleUrls: ['./add-writer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddWriterComponent implements OnInit, OnDestroy {
  colors = [
    { colorValue: '#BBDCFF', colorName: 'Blue' },
    { colorValue: '#E2F1FF', colorName: 'Light blue' },
    { colorValue: '#FFCFD5', colorName: 'Salmon' },
    { colorValue: '#FFECEF', colorName: 'Light Pink' },
  ];
  lastSubmittedWriter: Writer;
  writerAddedSub: Subscription;
  editMode: boolean = false;
  writerId: string;
  writer: Writer = null;
  loading: boolean = false;
  @ViewChild('addWriterForm') form: NgForm;
  @ViewChild('emailInput') emailInput: NgModel;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private writersService: WritersService,
    private _snackBar: MatSnackBar,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Add Writer | Address Dispenser');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('writerId')) {
        this.editMode = true;
        this.titleService.setTitle('Edit Writer | Address Dispenser');
        this.writerId = paramMap.get('writerId');
        this.loading = true;
        this.writersService.getWriter(this.writerId).subscribe((writer) => {
          this.loading = false;
          this.form.setValue({
            name: writer.name,
            email: writer.email,
            phone: writer.phone,
            prefersEmail: !writer.prefersText,
            defaultAddressAmount: writer.defaultAddressAmount,
            color: writer.color,
          });

          setTimeout(() => {
            this.onPrefersEmailChange();
          });
        });
      }
    });

    if (!this.editMode) {
      setTimeout(() => {
        this.form.form.get('phone').setValidators(Validators.required);
        this.form.form.get('phone').updateValueAndValidity();
      });
    }

    this.writerAddedSub = this.writersService
      .getWriterAddedListener()
      .subscribe((writerAdded) => {
        if (this.lastSubmittedWriter.name === writerAdded.name) {
          this._snackBar.open('Writer Added Successfully!', 'Close', {
            duration: 3000,
          });
        }
      });
  }

  onSubmit(form: NgForm) {
    let newWriter: Writer = {
      id: this.editMode ? this.writerId : null,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      prefersText: form.value.prefersEmail ? !form.value.prefersEmail : true,
      defaultAddressAmount: form.value.defaultAddressAmount,
      totalCheckedOut: 0,
      color: form.value.color
        ? form.value.color
        : this.colors[this.getRandomNumberBetween(0, this.colors.length - 1)]
            .colorValue,
    };

    if (this.editMode) {
      this.writersService.updateWriter(newWriter.id, newWriter);
      this.router.navigate(['/writers']);
    } else {
      this.writersService.addWriter(newWriter);
      this.form.resetForm();
    }

    this.lastSubmittedWriter = newWriter;
  }

  onPrefersEmailChange() {
    const emailField = this.form.form.get('email');
    const phoneField = this.form.form.get('phone');
    if (this.form.value.prefersEmail) {
      emailField.setValidators([Validators.email, Validators.required]);
      phoneField.setValidators([]);
      emailField.updateValueAndValidity();
      phoneField.updateValueAndValidity();
    } else {
      emailField.setValidators([Validators.email]);
      phoneField.setValidators([Validators.required]);
      emailField.updateValueAndValidity();
      phoneField.updateValueAndValidity();
    }
  }

  onCancel() {
    this.router.navigate(['/writers']);
  }

  // Javascript By Grepper on Jul 23 2019
  getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnDestroy() {
    this.writerAddedSub.unsubscribe();
  }
}
