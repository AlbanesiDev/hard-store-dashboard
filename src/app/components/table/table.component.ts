import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, output } from "@angular/core";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { Table, TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { SidebarService } from "../../core/services/sidebar.service";
import { TableUi } from "../../dashboard/sections/users-dashboard/users-dashboard.component";

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
        [currentPageReportTemplate]="'Mostrando {first} al {last} de {totalRecords} ' + tableUi().currentPage"
        [rows]="10"
        [value]="data()"
        [rowHover]="true"
        [paginator]="true"
        [globalFilterFields]="tableUi().filter"
        [rowsPerPageOptions]="[10, 20, 30]"
        [showCurrentPageReport]="true"
      >
        <ng-template pTemplate="caption">
          <div class="flex align-items-center justify-content-between pb-4">
            <h1 class="text-lg m-0">{{ tableUi().title }}</h1>
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
            @for (item of tableUi().th; track $index) {
              <th pSortableColumn="{{ item.pSortableColumn }}" [style]="{ width: item?.width }">
                {{ item.column_name }}<p-sortIcon field="{{ item.pSortableColumn }}" />
              </th>
            }
            <th></th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-data>
          <tr>
            <td>
              <p-tableCheckbox [value]="data"></p-tableCheckbox>
            </td>
            @for (item of tableUi().th; track $index) {
              <td class="capitalize">{{ data[item.pSortableColumn] }}</td>
            }
            @if (tableUi().isProduct) {
              <td>
                <p-tag [value]="data.stock + ' - ' + getTagValue(data.stock)" [severity]="getSeverity(data.stock)" />
              </td>
            }
            <td>
              <div class="flex gap-3">
                <p-button
                  icon="pi pi-pencil"
                  severity="info"
                  [outlined]="true"
                  [rounded]="true"
                  (onClick)="editProductClick(data.id_product)"
                />
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  [outlined]="true"
                  [rounded]="true"
                  (onBlur)="deleteProductClick(data.id_product)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  public sidebarService = inject(SidebarService);
  /**
   * @todo Implement interfaces
   */
  public tableUi = input.required<TableUi>();
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

  public editDataOut = output();
  public deleteDataOut = output();
  public deleteMultipleDataOut = output();

  public editProductClick(product: any): void {
    this.editDataOut.emit(product);
  }

  public deleteProductClick(product: any): void {
    this.deleteDataOut.emit(product);
  }

  public deleteMultipleProductsClick(products: any): void {
    this.deleteMultipleDataOut.emit(products);
  }

  public onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, "contains");
  }
}
