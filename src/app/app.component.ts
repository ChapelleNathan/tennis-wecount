import { Component, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  playerDatas = null;

  public playerDatasEvent($event){
    this.playerDatas = $event;
  }
}
