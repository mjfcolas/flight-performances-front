import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {User} from "../../domain/user/user";
import {UserRepository} from "../../domain/user/user.repository";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UserProfileComponent {
  nickname: string = "";
  isSaved: boolean = false;
  unexpectedError: boolean = false;
  userAlreadyExists: boolean = false;

  constructor(private readonly userRepository: UserRepository) {
    userRepository.getUser().subscribe(value => this.nickname = value.nickname);
  }

  save() {
    this.userRepository.saveUser(new User(this.nickname)).subscribe((operationResult) => {
      this.isSaved = operationResult.status === "SUCCESS";
      this.userAlreadyExists = operationResult.status === "ERROR" && operationResult.errorCode === "USER_ALREADY_EXISTS";
      this.unexpectedError = operationResult.status === "ERROR" && operationResult.errorCode !== "USER_ALREADY_EXISTS";
    });
  }
}
