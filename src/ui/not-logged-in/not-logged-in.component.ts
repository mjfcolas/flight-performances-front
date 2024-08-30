import {Component} from '@angular/core';
import {LoginRepository} from "../../domain/user/login.repository";

@Component({
  selector: 'not-logged-in',
  standalone: true,
  templateUrl: './not-logged-in.component.html',
  imports: []
})
export class NotLoggedInComponent {

  constructor(private readonly loginRepository: LoginRepository) {
  }

  login() {
    this.loginRepository.login();
  }
}
