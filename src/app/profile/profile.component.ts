import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {User} from '../model/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public profileForm;
  public user: User = null;
  public savedNotice: boolean = false;

  constructor(private auth: AuthService, private fb: FormBuilder) {
  }

  public hasAllObligatoryFields(): boolean {
    return !this.user || this.user.hasAllObligatoryFields();
  }

  public ngOnInit() {
    this.auth.userData.subscribe((userData: User) => {
      if (userData === null) {
        return;
      }
      console.log('profile got user data');
      this.user = userData;
      this.buildForm();
    });
  }

  public buildForm(): void {
    this.profileForm = this.fb.group({
      name: new FormControl(this.user.name, [
        Validators.required,
        Validators.minLength(1)]),
      lunch: [this.user.lunch],
      email: new FormControl({value: this.user.email, disabled: true}, Validators.required),
    });
  }

  public save() {
    if (!this.profileForm.valid) {
      return;
    }
    this.user.willAttend = true;
    this.patchUser();
  }

  public cancelRegistration() {
    this.user.willAttend = false;
    this.patchUser();
  }

  public patchUser() {
    this.user.name = this.profileForm.get('name').value;
    this.user.lunch = this.profileForm.get('lunch').value;
    this.user.patch().then((_) => {
      this.savedNotice = true;
      window.setTimeout(() => {
        this.savedNotice = false;
      }, 2000);
    });
  }
}
