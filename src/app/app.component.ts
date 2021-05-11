import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'address-dispenser';
  isMenuOpen: boolean = false;
  isSignedIn: boolean = true;

  onSideNavClick() {
    this.isMenuOpen = false;
  }
}
