import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Product { id:number; name:string; category:string; price:number; stock:number; }
interface Sale { id?:number; productId:number; productName:string; quantity:number; unitPrice:number; createdAt?:string; }

@Component({
  selector:'app-root',
  standalone:true,
  imports:[CommonModule, FormsModule],
  templateUrl:'./app.component.html'
})
export class AppComponent {
  private http=inject(HttpClient);
  products:Product[]=[];
  sales:Sale[]=[];
  selected?:Product;
  quantity=1;
  message='';
  constructor(){this.load();}
  load(){
    this.http.get<Product[]>('/api/products').subscribe({next:p=>this.products=p,error:()=>this.message='No se pudo cargar el inventario.'});
    this.http.get<Sale[]>('/api/sales').subscribe({next:s=>this.sales=s});
  }
  buy(p:Product){
    if(p.stock<1 || this.quantity<1 || this.quantity>p.stock){this.message='Cantidad no disponible.';return;}
    const sale:Sale={productId:p.id,productName:p.name,quantity:this.quantity,unitPrice:p.price};
    this.http.post<Sale>('/api/sales',sale).subscribe({
      next:()=>{this.message='Venta registrada.';this.load();},
      error:()=>this.message='No se pudo registrar la venta.'
    });
  }
}
