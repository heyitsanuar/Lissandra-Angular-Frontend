import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()
export class ProductService {
    public url: string;
    public previousProducts;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getProduct(id: string): Observable <any> {
        return this._http.get(`${this.url}/product/${id}`);
    }

    getProductsByCategory(category: string, page = 1): Observable <any> {
        return this._http.get(`${this.url}/product/${category}/${page}`);
    }

    getProductsByType(category: string, type: string, page = 1): Observable <any> {
        return this._http.get(`${this.url}/product/${category}/${type}/${page}`);
    }

    getTypesByCategory(category): Observable <any> {
        return this._http.get(`${this.url}/product/types/${category}`);
    }

    // Returns PREVIOUS PRODUCTS JSON from Local Storage
    getLocalStoragePreviousProducts() {
        const products = JSON.parse(localStorage.getItem('previous-products'));

        this.previousProducts = (products !== undefined) ? products : null;

        return this.previousProducts;
    }

    addLocalStoragePreviousProducts(newProduct) {
        const previousProducts = JSON.parse(localStorage.getItem('previous-products'));
        let products = [];
        let isListed = false;


        if (previousProducts) {
            previousProducts.forEach(product => {
                if (product._id === newProduct._id) {
                    isListed = true;
                }
            });

            if (isListed) {
                return;
            }

            products = previousProducts;

            // When the number of items stores is greater than 4, then the last item will be deleted
            // We make sure that there will always be 4 elements in the array
            if (products.length >= 4) {
                products.pop();
            }
        }

        // e add the current product as the last item in the array
        // Parsing previous products JSON to String in local storage
        products.unshift(newProduct);
        localStorage.setItem('previous-products', JSON.stringify(products));
    }
}
