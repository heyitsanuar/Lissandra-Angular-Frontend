import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'wishlist',
    templateUrl: './wishlist.component.html',
    providers: [UserService]
})
export class WishlistComponent implements OnInit {
    public wishlist: Product[];
    public url;
    public identity;
    public token;
    public status: string;
    public error: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        // Checking if token and identity are set in local storage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        // If user is not logged in, then will be redirected to home
        if (!this.token || !this.identity) {
            this._router.navigate(['/']);
        }

        this.loadProducts();
    }

    // Gets the products of the user's bag
    loadProducts() {
        this.wishlist = this._userService.getWishlist().products;
    }

    // Removes a given item from the user's bag
    removeFromWishlist(productId) {
        this._userService.removeFromWishlist(this.identity._id, productId).subscribe(
            response => {
                // Updates the bag and sets it up in local storage
                this.wishlist = response.wishlist.products;
                localStorage.setItem('wishlist', JSON.stringify(response.wishlist));
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

    // Redirects the a clicked product
    goToProduct(productId: string) {
        this._router.navigate(['/product/' + productId]);
    }

}
