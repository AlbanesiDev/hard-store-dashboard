import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { Table, TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";

@Component({
  selector: "app-table",
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, TableModule, TagModule],
  template: `
    <div class="card">
      <p-table
        #dt
        dataKey="id"
        selectionMode="multiple"
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} entradas"
        [rows]="10"
        [value]="data()"
        [rowHover]="true"
        [paginator]="true"
        [globalFilterFields]="['title', 'id_product']"
        [rowsPerPageOptions]="[10, 20, 30]"
        [showCurrentPageReport]="true"
      >
        <ng-template pTemplate="caption">
          <div class="flex align-items-center justify-content-between pb-4">
            <h1 class="text-lg m-0">Gestionar productos</h1>
            <span class="block mt-2 md:mt-0 p-input-icon-left">
              <i class="pi pi-search"></i>
              <input
                pInputText
                type="text"
                placeholder="Buscar..."
                class="w-full sm:w-auto"
                (input)="onGlobalFilter(dt, $event)"
              />
            </span>
          </div>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 3rem">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th pSortableColumn="id_product">Codigo<p-sortIcon field="id_product"></p-sortIcon></th>
            <th pSortableColumn="title">Titulo<p-sortIcon field="title"></p-sortIcon></th>
            <th pSortableColumn="price_special">Precio especial<p-sortIcon field="price_special"></p-sortIcon></th>
            <th pSortableColumn="price_list">Precio lista<p-sortIcon field="price_list"></p-sortIcon></th>
            <th pSortableColumn="stock">Stock<p-sortIcon field="stock"></p-sortIcon></th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>
              <p-tableCheckbox [value]="product"></p-tableCheckbox>
            </td>
            <td>{{ product.id_product }}</td>
            <td>{{ product.title }}</td>
            <td>{{ product.price_list | currency }}</td>
            <td>{{ product.price_special | currency }}</td>
            <td>
              <p-tag
                [value]="product.stock + ' - ' + getTagValue(product.stock)"
                [severity]="getSeverity(product.stock)"
              />
            </td>
            <td>
              <div class="flex gap-3">
                <p-button icon="pi pi-pencil" severity="info" [outlined]="true" [rounded]="true" />
                <p-button icon="pi pi-trash" severity="warning" [outlined]="true" [rounded]="true" />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="summary">
          <div class="flex align-items-center justify-content-between">
            En total hay {{ data() ? data().length : 0 }} productos.
          </div>
        </ng-template>
      </p-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  /**
   * @todo Implement interfaces
   */
  public data = input.required<any>();

  public getTagValue(stock: number): string {
    if (stock <= 0) {
      return "Sin stock";
    } else if (stock <= 20) {
      return "Poco stock";
    } else if (stock > 20) {
      return "Stock disponible";
    }
    return "Sin stock";
  }

  public getSeverity(stock: number): string {
    if (stock <= 0) {
      return "danger";
    } else if (stock <= 10) {
      return "warning";
    } else if (stock > 10) {
      return "success";
    }
    return "info";
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, "contains");
  }
}
