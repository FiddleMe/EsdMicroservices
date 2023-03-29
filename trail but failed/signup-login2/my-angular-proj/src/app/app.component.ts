import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-angular-proj';
}

//Angular will render the value of the class title property and update it any time it changes.
// This means Angular 6’s ng serve watches for our file changes and renders every time a change is introduced into any file.
// Steps: run ng serve in the cd /my-angular-projm use the http://localhost:4200 to see changes