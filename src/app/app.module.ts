import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppUiModule } from './ui-imports/app-ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './routing/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SendAddressesComponent } from './send-addresses/send-addresses.component';
import { AvailableAddressesComponent } from './addresses/available-addresses/available-addresses.component';
import { AssignedAddressesComponent } from './addresses/assigned-addresses/assigned-addresses.component';
import { FilterBottomSheetComponent } from './addresses/assigned-addresses/filter-bottom-sheet/filter-bottom-sheet.component';
import { WritersComponent } from './writers/writers.component';
import { AddAddressesComponent } from './addresses/add-addresses/add-addresses.component';
import { AddOneComponent } from './addresses/add-addresses/add-one/add-one.component';
import { AddManyComponent } from './addresses/add-addresses/add-many/add-many.component';
import { AddManyConfirmationComponent } from './addresses/add-addresses/add-many/add-many-confirmation/add-many-confirmation.component';
import { ValidAddressDirective } from './addresses/add-addresses/add-many/valid-address.directive';
import { AddWriterComponent } from './writers/add-writer/add-writer.component';
import { DeleteConfirmationComponent } from './shared/delete-confirmation/delete-confirmation.component';
import { AddressAssignDialogComponent } from './addresses/available-addresses/address-assign-dialog/address-assign-dialog.component';
import { CustomSendComponent } from './send-addresses/custom-send/custom-send.component';
import { SendConfirmationComponent } from './send-addresses/send-confirmation/send-confirmation.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';

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
    AddOneComponent,
    AddManyComponent,
    AddManyConfirmationComponent,
    ValidAddressDirective,
    AddWriterComponent,
    DeleteConfirmationComponent,
    AddressAssignDialogComponent,
    CustomSendComponent,
    SendConfirmationComponent,
    SignInComponent,
  ],
  entryComponents: [AddManyConfirmationComponent],
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
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
