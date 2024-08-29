import {Component} from '@angular/core';
import {LoginRepository} from "../../domain/user/login.repository";

@Component({
  selector: 'manage-profile',
  standalone: true,
  templateUrl: './manage-profile.component.html',
})
export class ManageProfileComponent {

  constructor(private readonly loginRepository: LoginRepository) {
  }

  login() {
    this.loginRepository.login();
  }

  logout() {
    this.loginRepository.logout();
  }

  isLoggedIn() {
    return this.loginRepository.isLoggedIn();
  }
}
