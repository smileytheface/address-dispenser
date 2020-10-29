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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'send-addresses', component: SendAddressesComponent },
  {
    path: 'available-addresses',
    component: AvailableAddressesComponent,
  },
  {
    path: 'available-addresses/add-addresses',
    component: AddAddressesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'add-one',
      },
      {
        path: 'add-one',
        component: AddOneComponent,
      },
      {
        path: 'add-many',
        component: AddManyComponent,
      },
    ],
  },
  { path: 'assigned-addresses', component: AssignedAddressesComponent },
  { path: 'writers', component: WritersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
