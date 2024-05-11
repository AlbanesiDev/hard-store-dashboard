import { Injectable, inject } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from "@angular/fire/firestore";
import { LocalStorageService } from "./local-storage.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private localStorageService: LocalStorageService = inject(LocalStorageService);
  private firestore: Firestore = inject(Firestore);

  private productCollection = collection(this.firestore, "products");

  private productsStorage: string = environment.localStorage.products;
  getProductsSmall(): Promise<any>{
    return Promise.resolve();
  }
  getProducts(): Observable<any> {
    const products = this.localStorageService.getItem(this.productsStorage);
    if (products) {
      console.log('datos del localStorage');
      return of(products);
    } else {
      console.log('datos de firebase');
      return collectionData(this.productCollection).pipe(
        tap({
          next: (value) => {
            this.localStorageService.setItem(this.productsStorage, value);
          },
        }),
      );
    }
  }

  createProduct(product: any): Promise<any> {
    return addDoc(this.productCollection, product);
  }

  updateProduct(product: any): Promise<void> {
    const docRef = doc(this.productCollection, product.id);
    return updateDoc(docRef, { ...product });
  }

  deleteProduct(product: any): Promise<void> {
    const docRef = doc(this.productCollection, product.id);
    return deleteDoc(docRef);
  }
}
