import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-bag-component',
    templateUrl: './bag.component.html',
    providers: [UserService]
})
export class BagComponent implements OnInit {
    public bag: Product[];
    public url: string;
    public identity;
    public token;
    public status: string;
    public error: string;
    public totalCost;

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
        this.updateTotalCost();
    }

    ngDoCheck() {
        this.updateTotalCost();
    }

    // Gets the products of the user's bag
    loadProducts() {
        this.bag = this._userService.getBag().products;
    }

    // Removes a given item from the user's bag
    removeFromBag(productId) {
        this._userService.removeFromBag(this.identity._id, productId).subscribe(
            response => {
                // Updates the bag and sets it up in local storage
                this.bag = response.bag.products;
                localStorage.setItem('bag', JSON.stringify(response.bag));
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

    // Updates the total cost when adding or removing products
    updateTotalCost() {
        this.totalCost = 0;

        this.bag.forEach(currentProduct => {
            this.totalCost += parseFloat(currentProduct.cost);
        });

        this.totalCost = this.totalCost.toFixed(2);
    }

}

