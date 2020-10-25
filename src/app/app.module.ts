import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppUiModule } from './app-ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SendAddressesComponent } from './send-addresses/send-addresses.component';
import { AvailableAddressesComponent } from './addresses/available-addresses/available-addresses.component';
import { AssignedAddressesComponent } from './addresses/assigned-addresses/assigned-addresses.component';
import { FilterBottomSheetComponent } from './addresses/assigned-addresses/filter-bottom-sheet/filter-bottom-sheet.component';
import { WritersComponent } from './writers/writers.component';
import { AddAddressesComponent } from './addresses/add-addresses/add-addresses.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SendAddressesComponent,
    AvailableAddressesComponent,
    AssignedAddressesComponent,
    FilterBottomSheetComponent,
    WritersComponent,
    AddAddressesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    AppUiModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
