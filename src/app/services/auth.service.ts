import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private supabaseService: SupabaseService, private router: Router) {
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log('Usuário logado:', session.user);
      } else {
        console.log('Usuário deslogado');
        this.router.navigate(['/login']);
      }
    });
  }

  getUser() {
    return this.supabaseService.client.auth.getUser();
  }

  logout() {
    return this.supabaseService.client.auth.signOut();
  }
}
