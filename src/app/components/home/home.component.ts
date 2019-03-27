import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { GLOBAL } from '../../services/global';
import { ProductService } from '../../services/product.service';
import { menuCategories } from '../../content/categories.content.js';

@Component({
    selector: 'app-home-component',
    templateUrl: './home.component.html',
    providers: [ProductService]
})
export class HomeComponent implements OnInit {
    public category: string;
    public description: string;
    public products: Product[];
    public url: string;

    constructor(
        private _router: Router,
        private _productService: ProductService
    ) {
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.getProducts();
    }

    // Changing classes for 4-hero-slider
    changeCategoryClasses(clickedElementIndex) {
        const categories = Array.from(document.getElementsByClassName('home-categories__item'));
        const infoContainer = document.getElementById('category-info');
        const categoryInfo = document.getElementsByClassName('category-info');

        categories.map((category, index) => {
            if (index !== clickedElementIndex) {
                category.classList.add('home-categories__item--invisible');
            }
        });

        this.fillInfoText(clickedElementIndex);

        infoContainer.classList.remove('category-info--hide');
        categoryInfo[0].classList.add('category-info--is-visible');
    }

    // When clicking back, categories are restored to their original value
    restoreCategories() {
        const categories = Array.from(document.getElementsByClassName('home-categories__item'));
        const infoContainer = document.getElementById('category-info');
        const categoryInfo = document.getElementsByClassName('category-info');

        categories.map( category => category.classList.remove('home-categories__item--invisible'));

        infoContainer.classList.add('category-info--hide');
        categoryInfo[0].classList.remove('category-info--is-visible');
    }

    // Changing category assets depending on the clicked one
    fillInfoText(key) {
        this.category = menuCategories[key].name;
        this.description = menuCategories[key].description;
    }

    // Redirects to a category when clicked on the 4-hero-slider
    goToCategory() {
        this._router.navigate([`/shop/${this.category}/1`]);
    }

    // Gets products for homepage
    getProducts() {
        this._productService.getProductsByCategory('Men', 1).subscribe(
            response => {
                this.products = response.products;
            },
            error => {
                const errorMessage = <any>error;

                if (errorMessage != null) {
                    this._router.navigate(['/']);
                }
            }
        );
    }

    // Redirects to a given product when clicked on homepage catalog
    goToProduct(productId: string) {
        this._router.navigate([`/product/${productId}`]);
    }
}
