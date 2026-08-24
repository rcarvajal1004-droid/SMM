import { Routes } from '@angular/router';
import { CLIMATECH_ROUTES } from './features/climatech/climatech.routes';
import { SMM_ROUTES } from './features/smm-layout/smm-layout.routes';

export const routes: Routes = [
  ...CLIMATECH_ROUTES,
  { path: 'smm', children: SMM_ROUTES },
  { path: '**', redirectTo: '' }
];
