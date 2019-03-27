import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-sign-up-component',
    templateUrl: './sign-up.component.html',
    providers: [UserService]
})
export class SignUpComponent implements OnInit {
    public user: User;
    public token: string;
    public identity;
    public status: string;
    public error: string;

    constructor(
        private _router: Router,
        private _userService: UserService
    ) {
        this.user = new User('', '', '', '', '', '');
    }

    ngOnInit() {
        // Checking if token and identity are set in local storage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        // If user is logged in already, then will be redirected to home
        if (this.token && this.identity) {
            this._router.navigate(['/']);
        }
    }

    // Registers the user
    onSubmit(form) {
        this._userService.register(this.user).subscribe(
            response => {
                if (response.user && response.user._id) {
                    this.status = 'Success';
                    form.reset();
                }
            },
            error => {
                const errorMessage = <any>error.error.message;

                if (errorMessage != null) {
                    this.status = 'Error';
                    this.error = errorMessage;
                }
            }
        );
    }
}
