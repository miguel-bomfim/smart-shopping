import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd, RouterOutlet } from "@angular/router";
import { filter } from 'rxjs';
import { MenuComponent } from './components/menu/menu.component';

@Component({
	selector: 'app-root',
	imports: [RouterModule, MenuComponent, RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	showMenu: boolean = true;

  	constructor(private router: Router) {
		// Monitora as mudanças de rota
		this.router.events.pipe(
		filter(event => event instanceof NavigationEnd)
		).subscribe((event: any) => {
		// Se a URL for '/login', esconde o menu. Caso contrário, mostra.
		this.showMenu = event.url !== '/login';
		});
	}
}
