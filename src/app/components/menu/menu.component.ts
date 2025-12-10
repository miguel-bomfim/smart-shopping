import { Component, ViewChild, OnInit } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from "@angular/router";

interface UserMetadata {
  name: string;
  avatar_url: string;
}

@Component({
  selector: 'app-menu',
  imports: [DrawerModule, ButtonModule, Ripple, AvatarModule, StyleClass, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
    @ViewChild('drawerRef') drawerRef!: Drawer;
    userMetadata: UserMetadata | undefined = undefined;

    closeCallback(e: Event): void {
      this.drawerRef.close(e);
    }

    visible: boolean = false;

    constructor(
      private readonly authService: AuthService
    ) {}

    ngOnInit(): void {

      this.authService.getUser().then(({ data }) => {
        if (data.user) {
          this.userMetadata = data.user.user_metadata as UserMetadata;
        }
      });
    }
}
