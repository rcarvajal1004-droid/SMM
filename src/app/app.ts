import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SpotlightComponent } from './features/spotlight/spotlight.component';
import { SpotlightService } from './features/spotlight/spotlight.service';
import { SmmApiService } from './core/services/smm-api.service';
import { SmmService } from './core/models/smm.model';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SpotlightComponent, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showSpotlight = false;
  services: SmmService[] = [];

  constructor(
    private spotlightService: SpotlightService,
    private api: SmmApiService
  ) {
    this.api.getServices().subscribe(data => {
      this.services = data;
      this.spotlightService.services = data;
    });

    this.spotlightService.open$.subscribe(() => {
      this.showSpotlight = true;
    });

    this.spotlightService.close$.subscribe(() => {
      this.showSpotlight = false;
    });
  }

  onSpotlightClose() {
    this.showSpotlight = false;
  }
}
