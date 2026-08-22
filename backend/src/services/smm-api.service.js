import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SmmService, SmmOrder, UserProfile } from '../models/smm.model';

const MOCK_SERVICES: SmmService[] = [
  { id: 1, name: 'Instagram Followers', category: 'Instagram', ratePer1000: 12.5, min: 50, max: 10000, description: 'Seguidores reales de Instagram' },
  { id: 2, name: 'Instagram Likes', category: 'Instagram', ratePer1000: 5.0, min: 100, max: 50000, description: 'Likes en publicaciones de Instagram' },
  { id: 3, name: 'Instagram Views', category: 'Instagram', ratePer1000: 2.0, min: 500, max: 100000, description: 'Visualizaciones en reels' },
  { id: 4, name: 'TikTok Followers', category: 'TikTok', ratePer1000: 18.0, min: 50, max: 5000, description: 'Seguidores de TikTok' },
  { id: 5, name: 'TikTok Likes', category: 'TikTok', ratePer1000: 6.5, min: 100, max: 50000, description: 'Likes en videos de TikTok' },
  { id: 6, name: 'YouTube Views', category: 'YouTube', ratePer1000: 3.5, min: 500, max: 100000, description: 'Visualizaciones en YouTube' },
  { id: 7, name: 'YouTube Subscribers', category: 'YouTube', ratePer1000: 25.0, min: 50, max: 2000, description: 'Suscriptores de YouTube' },
  { id: 8, name: 'Spotify Plays', category: 'Spotify', ratePer1000: 15.0, min: 100, max: 10000, description: 'Reproducciones en Spotify' },
  { id: 9, name: 'Telegram Members', category: 'Telegram', ratePer1000: 20.0, min: 50, max: 5000, description: 'Miembros para canal de Telegram' }
];

const MOCK_ORDERS: SmmOrder[] = [
  { id: 101, serviceId: 1, serviceName: 'Instagram Followers', link: 'https://instagram.com/user1', quantity: 500, charge: 6.25, status: 'Completed', createdAt: '2024-01-15' },
  { id: 102, serviceId: 4, serviceName: 'TikTok Likes', link: 'https://tiktok.com/@user2/video/123', quantity: 1000, charge: 6.50, status: 'In progress', createdAt: '2024-01-16' },
  { id: 103, serviceId: 6, serviceName: 'YouTube Views', link: 'https://youtube.com/watch?v=abc123', quantity: 5000, charge: 17.50, status: 'Pending', createdAt: '2024-01-17' }
];

@Injectable({ providedIn: 'root' })
export class SmmApiService {
  private balance = 156.75;

  getServices(): Observable<SmmService[]> {
    return of([...MOCK_SERVICES]).pipe(delay(600));
  }

  createOrder(order: Partial<SmmOrder>): Observable<SmmOrder> {
    const newOrder: SmmOrder = {
      id: Date.now(),
      serviceId: order.serviceId!,
      serviceName: order.serviceName || 'Servicio',
      link: order.link || '',
      quantity: order.quantity || 0,
      charge: order.charge || 0,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    MOCK_ORDERS.unshift(newOrder);
    this.balance -= newOrder.charge;
    return of(newOrder).pipe(delay(500));
  }

  getOrders(): Observable<SmmOrder[]> {
    return of([...MOCK_ORDERS]).pipe(delay(400));
  }

  getBalance(): Observable<{ balance: number }> {
    return of({ balance: this.balance }).pipe(delay(300));
  }

  getProfile(): Observable<UserProfile> {
    return of({ id: 1, username: 'demo_user', balance: this.balance, apiKey: 'sk_mock_key' }).pipe(delay(300));
  }
}
