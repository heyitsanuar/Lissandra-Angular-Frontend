import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { GLOBAL } from '../../services/global';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-item-component',
    templateUrl: './item.component.html',
    providers: [
        ProductService,
        UserService
    ]
})
export class ItemComponent implements OnInit {
    public product: Product;
    public id;
    public url: string;
    public token;
    public identity;
    public status: string;
    public error: string;
    public isInWishlist: boolean;
    public isInBag: boolean;

    constructor(
        private _productService: ProductService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.url = GLOBAL.url;
        this.isInBag = false;
        this.isInWishlist = false;
    }

    ngOnInit() {
        // Loading product data
        this.getProductId();
        this.loadProduct();

        // Gets both identity and token in order to check whether the user is logged in or not
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();

        // Checks whether the current product is listed both in bag and wishlist
        this.checkIfOnList(this.id);
    }

    // Gets the ID of the product by reading the current url and its params
    getProductId() {
        this._route.params.subscribe(params => { this.id = params['id']; });
    }

    // Loads the product by using the ID given in the URL
    loadProduct() {
        this._productService.getProduct(this.id).subscribe(
            response => {
                // Persisting data in local storage for previously seen products
                this.product = response.product;
                this._productService.addLocalStoragePreviousProducts(this.product);
            },
            error => {
                const errorMessage = <any>error;

                if (errorMessage != null) {
                    this._router.navigate(['/']);
                }
            }
        );
    }

    // Resets all product flags
    refreshProduct(event) {
        // Restarting flags to control both wishlist and bag
        this.isInBag = false;
        this.isInWishlist = false;

        // Loading product data
        this.id = event;
        this.loadProduct();

        // Checks whether the current product is listed both in bag and wishlist
        this.checkIfOnList(this.id);
    }

    // Checks whether the product is either in wishlist or shopping bag
    checkIfOnList(productId) {
        // Allocating wishlist and bag data from local storage
        const wishlist = JSON.parse(localStorage.getItem('wishlist'));
        const bag = JSON.parse(localStorage.getItem('bag'));

        // Checks if the products exist in bag
        bag.forEach(currentProductInBag => {
           if (productId === currentProductInBag._id) {
               this.isInBag = true;
           }
        });

        // Checks if the products exist in wishlist
        wishlist.forEach(currentProductInWishlist => {
            if (productId === currentProductInWishlist._id) {
                this.isInWishlist = true;
            }
        });
    }

    // Gets the user bag by making a GET request and sets it into local storage
    getUserBag() {
        this._userService.loadUserBag(this.identity._id).subscribe(
            response => {
                localStorage.setItem('bag', JSON.stringify(response.bag[0]));
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

    // Gets the user wishlist by making a GET request and sets it into local storage
    getUserWishlist() {
        this._userService.loadUserWishlist(this.identity._id).subscribe(
            response => {
                localStorage.setItem('wishlist', JSON.stringify(response.wishlist[0]));
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

    // Adds an item to the bag and sets it into local storage
    addItemToBag() {
        if (!this.identity) {
            this._router.navigate(['/login']);
            return;
        }

        this._userService.addToBag(this.identity._id, this.product._id).subscribe(
            response => {
                // Changing product state
                this.status = 'Success';
                this.isInBag = true;
                // Refreshing local storage items
                this.getUserBag();
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

    // Removes an item both from bag and local storage
    removeItemFromBag() {
        if (!this.identity) {
            this._router.navigate(['/login']);
            return;
        }

        this._userService.removeFromBag(this.identity._id, this.product._id).subscribe(
            response => {
                // Changing product state
                this.status = 'Success';
                this.isInBag = false;

                // Refreshing local storage items
                this.getUserBag();
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

    // Adds an item to the wishlist and sets it into local storage
    addItemToWishlist() {
        if (!this.identity) {
            this._router.navigate(['/login']);
            return;
        }

        this._userService.addToWishlist(this.identity._id, this.product._id).subscribe(
            response => {
                // Changing product state
                this.status = 'Success';
                this.isInWishlist = true;
                // Refreshing local storage items
                this.getUserWishlist();
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

    // Removes an item both from wishlist and local storage
    removeItemFromWishlist() {
        if (!this.identity) {
            this._router.navigate(['/login']);
            return;
        }

        this._userService.removeFromWishlist(this.identity._id, this.product._id).subscribe(
            response => {
                // Changing product state
                this.status = 'Success';
                this.isInWishlist = false;

                // Refreshing local storage items
                this.getUserWishlist();
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
