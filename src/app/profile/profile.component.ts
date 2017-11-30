import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser;
  isEditing;
  profileForm;

  constructor(private auth: AuthService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
    this.currentUser = this.auth.currentUser;
  }

  buildForm(): void {
    this.profileForm = this.fb.group({
      displayName: [null],
      lunch: [null],
    });
    this.updateFormValues();
  }

  updateFormValues(): void {
    this.profileForm.setValue({
      displayName: this.auth.currentUserDisplayName,
      lunch: this.auth.lunch ? this.auth.lunch : null,
    });
  }

  save() {
    this.isEditing = false;
    if (!this.profileForm.valid) {
      return;
    }
    const userDataPatch = {...this.profileForm.value};
    userDataPatch.lunch = userDataPatch.lunch ? userDataPatch.lunch : false;
    this.auth.updateUser(userDataPatch);
  }
}
