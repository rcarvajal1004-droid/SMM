import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmmApiService } from '../../core/services/smm-api.service';
import { SmmService } from '../../core/models/smm.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  services: SmmService[] = [];
  loading = true;

  constructor(private api: SmmApiService) {}

  ngOnInit(): void {
    this.api.getServices().subscribe(data => {
      this.services = data;
      this.loading = false;
    });
  }
}
