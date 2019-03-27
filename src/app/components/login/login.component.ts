import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute,  Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-login-component',
    templateUrl: './login.component.html',
    providers: [UserService]
})
export class LoginComponent implements OnInit {
    public user: User;
    public identity;
    public token;
    public bag;
    public wishlist;
    public status: string;
    public error: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.user = new User('', '', '', '', '', 'ROLE_USER');
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

    // Signs in the user
    onSubmit(form) {
        this._userService.signIn(this.user).subscribe(
            response => {
                if (!response.user || !response.user._id) {
                    return this.status = 'Error';
                }

                this.identity = response.user;

                localStorage.setItem('identity', JSON.stringify(this.identity));

                this.getToken();
                this._router.navigate(['/']);
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

    // Gets token and saves it into local storage
    getToken() {
        this._userService.signIn(this.user, 'true').subscribe(
            response => {
                this.token = response.token;

                if (this.token.length <= 0) {
                    this.status = 'Error';
                } else {
                    localStorage.setItem('token', JSON.stringify(this.token));

                    this.getUserBag();
                    this.getUserWishlist();
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

    // Gets user's bag and saves it into local storage
    getUserBag() {
        this._userService.loadUserBag(this.identity._id).subscribe(
            response => {
                this.bag = response.bag[0];

                localStorage.setItem('bag', JSON.stringify(this.bag));
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

    // Gets user's wishlist and saves it into local storage
    getUserWishlist() {
        this._userService.loadUserWishlist(this.identity._id).subscribe(
            response => {
                this.wishlist = response.wishlist[0];

                localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
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
