import {Component,inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
interface Product{id:number;name:string;category:string;price:number;stock:number}
interface Sale{id:number;productId:number;productName:string;quantity:number;unitPrice:number;createdAt:string}
@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./app.component.html'})
export class AppComponent{
 private http=inject(HttpClient); products:Product[]=[]; sales:Sale[]=[]; quantities:Record<number,number>={}; message=''; error=false;
 constructor(){this.load()}
 load(){this.loadProducts();this.loadSales()}
 loadProducts(){this.http.get<Product[]>('/api/products').subscribe({next:p=>{this.products=p;for(const x of p)this.quantities[x.id]=this.quantities[x.id]||1},error:()=>this.fail('No se pudo cargar el inventario.')})}
 loadSales(){this.http.get<Sale[]>('/api/sales').subscribe({next:s=>this.sales=s})}
 buy(p:Product){const q=this.quantities[p.id]||1;if(q<1||q>p.stock){this.fail('La cantidad solicitada no está disponible.');return}
  this.http.post<Sale>('/api/sales',{productId:p.id,quantity:q}).subscribe({next:()=>{this.error=false;this.message=`Compra realizada. Stock restante: ${p.stock-q}`;this.loadProducts();this.loadSales();this.quantities[p.id]=1},error:e=>{this.fail(e.error||'No se pudo registrar la compra.');this.loadProducts()}})}
 fail(m:string){this.error=true;this.message=m}
}
