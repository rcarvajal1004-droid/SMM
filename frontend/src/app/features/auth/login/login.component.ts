import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppState } from '../../../core/state/app.state';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Iniciar sesión</h1>
        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label for="identifier">Usuario o Email</label>
            <input
              id="identifier"
              type="text"
              name="identifier"
              [(ngModel)]="identifier"
              required
              minlength="1"
              #identifierCtrl="ngModel"
              autocomplete="username"
            />
            @if (identifierCtrl.invalid && identifierCtrl.touched) {
              <span class="error">Usuario o email requerido</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="1"
              #passwordCtrl="ngModel"
              autocomplete="current-password"
            />
            @if (passwordCtrl.invalid && passwordCtrl.touched) {
              <span class="error">Contraseña requerida</span>
            }
          </div>

          <button type="submit" [disabled]="form.invalid || state.isLoading('login')" class="btn btn-primary">
            @if (state.isLoading('login')) {
              <span class="spinner"></span> Entrando...
            } @else {
              Entrar
            }
          </button>
        </form>

        <p class="auth-link">
          ¿No tienes cuenta? <a routerLink="/register">Regístrate</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    h1 { margin-bottom: 1.5rem; color: #1a1a2e; text-align: center; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333; }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
    .error { color: #e53e3e; font-size: 0.875rem; margin-top: 0.25rem; display: block; }
    .btn { width: 100%; padding: 0.875rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102,126,234,0.4); }
    .btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .spinner { width: 16px; height: 16px; border: 2px solid transparent; border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-link { text-align: center; margin-top: 1.5rem; color: #666; }
    .auth-link a { color: #667eea; text-decoration: none; font-weight: 500; }
    .auth-link a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  private router = inject(Router);
  protected state = inject(AppState);
  private toast = inject(ToastService);

  identifier = '';
  password = '';

  async onSubmit() {
    try {
      await this.state.login(this.identifier, this.password);
      this.toast.success('Bienvenido de nuevo');
      this.router.navigate(['/']);
    } catch {
    }
  }
}