import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  imports: [ButtonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(private supabaseService: SupabaseService) {}

  async loginWithGoogle() {
    const redirectTo = `${window.location.origin}`;

    const { error } = await this.supabaseService.client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });

    if (error) {
      console.error('Erro ao fazer login:', error.message);
    }
  }

  async logout() {
    await this.supabaseService.client.auth.signOut();
  }
}
