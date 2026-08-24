import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { SmmService } from '../smm/models/smm.model';

@Injectable({ providedIn: 'root' })
export class SpotlightService {
  private isVisible = false;
  services: SmmService[] = [];

  open$ = new Subject<void>();
  close$ = new Subject<void>();
  serviceSelected$ = new Subject<SmmService>();

  constructor(private ngZone: NgZone) {
    this.registerShortcut();
  }

  private registerShortcut() {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('keydown', (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
          event.preventDefault();
          this.ngZone.run(() => {
            if (this.isVisible) {
              this.close();
            } else {
              this.open();
            }
          });
        }
      });
    });
  }

  open() {
    this.isVisible = true;
    this.open$.next();
  }

  close() {
    this.isVisible = false;
    this.close$.next();
  }

  selectService(service: SmmService) {
    this.serviceSelected$.next(service);
    this.close();
  }
}
