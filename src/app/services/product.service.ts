import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()
export class ProductService {
    public url: string;
    public previousProducts;
    
    constructor(
        private _http: HttpClient
    ){
        this.url = GLOBAL.url;
    }

    // GET '/login' Gets a product by a given ID 
    getProduct(id): Observable<any>{
        //Returning response from GET request with headers
        return this._http.get(this.url+'product/'+id);
    }

    // GET '/product/:category/1' Gets the first page of products from the given category
    getProductsByCategory(category, page = 1): Observable<any>{
        return this._http.get(this.url+'product/'+category+'/'+page);
    }

    // GET '/product/:category/:type/1' Gets the first page of products from the given type and category
    getProductsByType(category, type, page = 1): Observable<any>{

        return this._http.get(this.url+'product/'+category+'/'+type+'/'+page);
    }

    // GET '/product/types/:category' Gets the types of a category (Men, Women, Girls, Boys)
    getTypesByCategory(category): Observable<any>{
        return this._http.get(this.url+'product/types/'+category);
    }

    //Returns PREVIOUS PRODUCTS JSON from Local Storage
    getLocalStoragePreviousProducts(){
        //Parsing previous products to JSON from the string allocated in local storage
        //If different from undefined, the value will be set
        let products = JSON.parse(localStorage.getItem('previous-products'));
        this.previousProducts = (products != undefined) ? products : null;

        //Returning previous products either from local storage or null value
        return this.previousProducts;
    }

    //Updates PREVIOUS PRODUCTS JSON to Local Storage
    addLocalStoragePreviousProducts(newProduct){
        //Parsing identity to JSON from the string allocated in local storage
        //If different from undefined, the value will be set
        let products = [];
        let previousProducts = JSON.parse(localStorage.getItem('previous-products'));

        //Flag to determine if product is already listen
        let isListed = false;

        //If previous products exist in local storage
        if(previousProducts != undefined){
            
            //Checking whether the product is in local storage already
            previousProducts.forEach(product => {
                if(product._id == newProduct._id){
                    isListed = true;
                }
            });

            if(isListed){
                return;
            }

            products = previousProducts;
    
            //When the number of items stores is greater than 4, then the last item will be deleted
            //We make sure that there will always be 4 elements in the array
            if(products.length >= 4){
                products.pop();
            }
        }

        //We add the current product as the last item in the array
        //Parsing previous products JSON to String in local storage
        products.unshift(newProduct);
        localStorage.setItem('previous-products', JSON.stringify(products));
    }
}