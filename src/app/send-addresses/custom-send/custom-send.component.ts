import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-send',
  templateUrl: './custom-send.component.html',
  styleUrls: ['./custom-send.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomSendComponent implements OnInit {
  prefersText: boolean;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    console.log(form);
  }

  onCancel() {
    this.router.navigate(['/send-addresses']);
  }
}
