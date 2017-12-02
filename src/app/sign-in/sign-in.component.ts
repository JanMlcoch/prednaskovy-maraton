import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {
  public signInForm: FormGroup;
  public subscription;
  public isUnknownError = false;
  public isInvalidCredentials = false;
  public formErrors = {
    'email': '',
    'password': ''
  };
  public validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    }
  };

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<SignInComponent>,
              private router: Router,
              private auth: AuthService) {
  }

  public ngOnInit() {
    this.buildForm();
  }

  public login(): void {
    this.isInvalidCredentials = false;
    this.auth.emailLogin(this.signInForm.value['email'], this.signInForm.value['password']).then(success => {
      if (this.auth.authenticated) {
        this.closeDialog();
      } else {
        this.isInvalidCredentials = true;
      }
    });
  }


  public buildForm(): void {
    this.signInForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

    this.subscription = this.signInForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  public onValueChanged(data?: any) {
    if (!this.signInForm) {
      return;
    }
    const form = this.signInForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public signInWithGoogle(): void {
    this.auth.googleLogin()
      .then(() => this.afterSignIn());
  }

  public signInWithFacebook(): void {
    this.auth.facebookLogin()
      .then(() => this.afterSignIn());
  }

  private afterSignIn(): void {
    // Do after login stuff here, such router redirects, toast messages, etc.
    if (this.auth.authenticated) {
      this.router.navigate(['/']);
      this.closeDialog();
    } else {
      this.isUnknownError = true;
    }
  }
}
