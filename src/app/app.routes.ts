import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HvacServicesComponent } from './pages/hvac-services/hvac-services.component';
import { ElectricalServicesComponent } from './pages/electrical-services/electrical-services.component';
import { BookingComponent } from './pages/booking/booking.component';
import { QuoteToolComponent } from './pages/quote-tool/quote-tool.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'hvac-services', component: HvacServicesComponent },
  { path: 'electrical-services', component: ElectricalServicesComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'quote-tool', component: QuoteToolComponent },
];
