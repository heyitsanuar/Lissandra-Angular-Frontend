import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { GLOBAL } from '../../services/global';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-shop-component',
    templateUrl: './shop.component.html',
    providers: [ProductService]
})
export class ShopComponent implements OnInit {
    public products: Product[];
    public status: string;
    public url: string;
    public page;
    public nextPage;
    public prevPage;
    public pages;
    public total;
    public category: string;
    public type: string;
    public types: string[];
    public categories: string[];
    public filter;

    constructor(
        private _productService: ProductService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.url = GLOBAL.url;
        this.category = 'Men';
        this.categories = ['Women', 'Girls', 'Boys'];
    }

    ngOnInit() {
        this.filter = document.getElementById('menu-category');

        // Loads menu assets
        this.actualCategory();
        this.actualType();
        this.actualPage();
        this.updateFilterTypes();
    }

    // Updates the actual category
    actualCategory() {
        this._route.params.subscribe(params => {
            let index;
            this.category = 'Men';

            if (params['category']) {
                index = this.categories.indexOf(params['category']);
                this.categories[index] = this.category;

                this.category = params['category'];

            }
        });
    }

    // Updates the current type within the category
    actualType() {
        this._route.params.subscribe(params => {
            if (params['type']) {
                this.type = params['type'];
            }
        });
    }

    // Gets teh actual page
    actualPage() {
        this._route.params.subscribe(params => {
            let page = +params['page'];

            if (!params['page']) {
                page = 1;
            }

            this.page = page;

            if (!page) {
                page = 1;
            } else {
                this.nextPage = page + 1;
                this.prevPage = (this.prevPage <= 0) ? 1 : page - 1;
            }

            if (this.type == null) {
                this.getProductsByCategory(page, this.category);
            } else {
                this.getProductsByType(this.category, this.type, page);
            }
        });
    }

    // Gets list of products from a given category
    getProductsByCategory(page, category) {
        this._productService.getProductsByCategory(category, page).subscribe(
            response => {
                if (response) {
                    this.products = response.products;
                    this.pages = response.pages;
                } else {
                    this.status = 'Error';
                }
            },
            error => {
                const errorMessage = <any>error.error.message;

                if (errorMessage != null) {
                    this.status = 'Error';
                    this._router.navigate(['/']);
                }
            }
        );
    }

    getProductsByType(category, type, page) {
        this._productService.getProductsByType(category, type, page).subscribe(
            response => {
                if (response) {
                    this.products = response.products;
                    this.pages = response.pages;
                } else {
                    this.status = 'Error';
                }
            },
            error => {
                const errorMessage = <any>error.error.message;

                if (errorMessage != null) {
                    this.status = 'Error';
                    this._router.navigate(['/']);
                }
            }
        );
    }

    updateFilterTypes() {
        this._productService.getTypesByCategory(this.category).subscribe(
            response => {
                this.types = response.types;
            },
            error => {
                const errorMessage = <any>error.error.message;

                if (errorMessage != null) {
                    this.status = 'Error';
                    this._router.navigate(['/']);
                }
            }
        );
    }

    // Resets all shop products, menu categories, and types
    updateCategory(category) {
        const index = this.categories.indexOf(category);

        this.categories[index] = this.category;
        this.category = category;
        this.type = null;

        // Update page, types, categories
        this.actualPage();
        this.updateFilterTypes();
    }

    // Updates the current type within the category
    updateType(type) {
        this.type = type;
        this.actualPage();
    }

    // Changes the current page to call other products
    changePage(direction) {
        if (direction === 'back') {
            this.nextPage = this.page;
            this.page = this.prevPage;
            this.prevPage = (this.prevPage <= 0) ? 1 : this.page - 1;
        } else {
            this.prevPage = this.page;
            this.page = this.nextPage;
            this.nextPage = (this.nextPage === this.pages) ? this.pages : this.page + 1;
        }

        if (this.type == null) {
            this.getProductsByCategory(this.page, this.category);
        } else {
            this.getProductsByType(this.category, this.type, this.page);
        }
    }

    // Redirects to a given product when clicked
    goToProduct(productId: string) {
        this._router.navigate([`/product/${productId}`]);
    }

    // Toggles filter menu in Mobile Devices
    toggleFilter() {
        this.filter.classList.toggle('category--is-expanded');
    }
}
