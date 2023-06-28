import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PlayerFormComponent } from './components/forms/player-form/player-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GameWindowComponent } from './components/game-window/game-window.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PlayerFormComponent,
    GameWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
