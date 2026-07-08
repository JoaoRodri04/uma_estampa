import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public showSplash = true;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showSplash = false;
    }, 1600);
  }
}
