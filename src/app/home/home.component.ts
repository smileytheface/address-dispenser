import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  onSendAddresses() {
    this.router.navigate(['/send-addresses']);
  }

  onAddresses() {
    this.router.navigate(['/available-addresses']);
  }

  onWriters() {
    this.router.navigate(['/writers']);
  }
}
