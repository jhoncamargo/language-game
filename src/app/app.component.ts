import {Component, HostListener} from '@angular/core';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private userService: UserService) {}

  @HostListener('window:beforeunload', ['$event'])
  clearInfo($event) {
    this.userService.invalidateUser();
  }
}

