import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { GLOBAL } from '../../services/global';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    providers: [ProductService]
})
export class HomeComponent implements OnInit {
    public category: string;
    public description: string;
    public products: Product[];
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _productService: ProductService
    ) {
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.getProducts();
    }

    // Changing classes for 4-hero-slider
    changeCategoryClasses(clickedElementIndex){
        let categories = document.getElementsByClassName('home-categories__item');
        let infoContainer = document.getElementById('category-info');
        let categoryInfo = document.getElementsByClassName('category-info');

        for (let i = 0; i < categories.length; i++) {
            if (i === clickedElementIndex) {
                continue;
            }

            categories[i].classList.add('home-categories__item--invisible');
        }

        this.fillInfoText(clickedElementIndex);

        infoContainer.classList.remove('category-info--hide');
        categoryInfo[0].classList.add('category-info--is-visible');
    }

    // When clicking back, categories are restored to their original value
    restoreCategories() {
        let categories = document.getElementsByClassName('home-categories__item');
        let infoContainer = document.getElementById('category-info');
        let categoryInfo = document.getElementsByClassName('category-info');

        for (let i = 0; i < categories.length; i++) {
            categories[i].classList.remove('home-categories__item--invisible');
        }

        infoContainer.classList.add('category-info--hide');
        categoryInfo[0].classList.remove('category-info--is-visible');
    }

    // Changing category assets depending on the clicked one
    fillInfoText(key) {
        // Making statements of the existing categories
        const categories = ['Men', 'Women', 'Boys', 'Girls'];
        let descriptions = [];

        //Allocating info to array
        descriptions[0] = "You'll need to grab something nice for dad, your brother, or maybe even something for that guy you've been dating. It doesn't matter if he's a certified street-style star that James Bond would be jealous";
        descriptions[1] = "Give your office attire an overhaul by taking inspiration from our pick of the most stylish (and successful) working women. Whether that's adopting Victoria Beckham's chic separates, Angelina Jolie's immaculate tailoring or Phoebe Philo's retrained minimalism, this is how you dress to impress";
        descriptions[2] = "Be bold. Be you. Our selection of boys graphic tees, jackets, and more is easy to mix, match and make your own. Shop jeans for boys to wear every day of the year, or pick up a button-up shirt for birthdays. Our on-trend coats are the best way to stand out from the crowd, and our cozy hoodies layer underneath for an easy outfit.";
        descriptions[3] = "Make moves in our girls activewear, which comes in bright colors, fun patterns and fabric that moves with you. Get set for sleepovers in our comfy, snug-fitting PJs. With so many great finds on sale, you're bound to get some amazing deals!";
        
        this.category = categories[key];
        this.description = descriptions[key];
    }

    // Redirects to a category when clicked on the 4-hero-slider
    goToCategory() {
        this._router.navigate(['/shop/' + this.category + '/1']);
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
        this._router.navigate(['/product/' + productId]);
    }
}
