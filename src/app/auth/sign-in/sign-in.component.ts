import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent implements OnInit, OnDestroy {
  private authErrorSub: Subscription;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authErrorSub = this.authService
      .getAuthError()
      .subscribe((errorMessage) => {
        this.snackBar.open(errorMessage, 'Okay');
      });
  }

  onSubmit(form: NgForm) {
    this.authService.signIn(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authErrorSub.unsubscribe();
  }
}
