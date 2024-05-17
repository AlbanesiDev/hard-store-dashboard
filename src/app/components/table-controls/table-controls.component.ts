import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-table-controls",
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="card flex justify-content-between">
      <div class="flex gap-3">
        <p-button icon="pi pi-plus" label="Agregar" severity="success" [outlined]="true" (onClick)="createData()" />
        <p-button
          icon="pi pi-trash"
          label="Eliminar"
          severity="danger"
          [outlined]="true"
          [disabled]="disabledDeleteSig()"
          (onClick)="deleteData()"
        />
      </div>
      <div class="flex gap-3">
        <p-button
          icon="pi pi-plus"
          label="Importar"
          severity="info"
          [outlined]="true"
          [disabled]="authService.rolSig() == 'empleado' || authService.rolSig() == undefined"
          (onClick)="importData()"
        />
        <p-button
          icon="pi pi-upload"
          label="Exportar"
          severity="help"
          [outlined]="true"
          [disabled]="authService.rolSig() == 'empleado' || authService.rolSig() == undefined"
          (onClick)="exportData()"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableControlsComponent {
  public authService = inject(AuthService);

  public disabledDeleteSig = input.required<boolean>();

  public createDataOut = output();
  public deleteDataOut = output();
  public importDataOut = output();
  public exportDataOut = output();

  public createData(): void {
    this.createDataOut.emit();
  }

  public deleteData(): void {
    this.deleteDataOut.emit();
  }

  public importData(): void {
    this.importDataOut.emit();
  }

  public exportData(): void {
    this.exportDataOut.emit();
  }
}
