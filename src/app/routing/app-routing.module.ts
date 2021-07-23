import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SendAddressesComponent } from '../send-addresses/send-addresses.component';
import { AvailableAddressesComponent } from '../addresses/available-addresses/available-addresses.component';
import { AssignedAddressesComponent } from '../addresses/assigned-addresses/assigned-addresses.component';
import { WritersComponent } from '../writers/writers.component';
import { AddAddressesComponent } from '../addresses/add-addresses/add-addresses.component';
import { AddOneComponent } from '../addresses/add-addresses/add-one/add-one.component';
import { AddManyComponent } from '../addresses/add-addresses/add-many/add-many.component';
import { AddWriterComponent } from '../writers/add-writer/add-writer.component';
import { CustomSendComponent } from '../send-addresses/custom-send/custom-send.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'send-addresses',
    component: SendAddressesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'send-addresses/custom-send',
    component: CustomSendComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'available-addresses',
    component: AvailableAddressesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'available-addresses/add-addresses',
    component: AddAddressesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'add-one',
        canActivate: [AuthGuard],
      },
      {
        path: 'add-one',
        component: AddOneComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'add-many',
        component: AddManyComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'available-addresses/edit/:addressId',
    component: AddOneComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'assigned-addresses',
    component: AssignedAddressesComponent,
    canActivate: [AuthGuard],
  },
  { path: 'writers', component: WritersComponent, canActivate: [AuthGuard] },
  {
    path: 'writers/add-writer',
    component: AddWriterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'writers/edit/:writerId',
    component: AddWriterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
