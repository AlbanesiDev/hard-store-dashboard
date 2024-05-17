import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, effect, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";

import { CompareObjectsService } from "../../../../../core/services/compare-objects.service";
import { DialogService } from "../../../../../core/services/dialog.service";
import { UsersService } from "../../../../../core/services/users.service";

@Component({
  selector: "app-edit-user",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DialogModule, ButtonModule, DropdownModule],
  template: `
    <p-dialog
      class="p-fluid"
      closable="false"
      [modal]="true"
      [style]="{ width: '450px', height: '630px' }"
      [draggable]="false"
      [(visible)]="dialogService.editUser"
    >
      <ng-template pTemplate="header">
        <div class="flex justify-content-between align-items-center w-full">
          <h2 class="select-none m-0">Editar usuario</h2>
          <p-button icon="pi pi-times" [rounded]="true" [text]="true" (onClick)="cancelEditUser($event)" />
        </div>
      </ng-template>
      <ng-template pTemplate="content">
        <div class="flex justify-content-center mt-2">
          <form [formGroup]="formData">
            <div class="field">
              <label for="title">Nombre</label>
              <input
                pInputText
                required
                autofocus
                type="text"
                id="name"
                formControlName="name"
                placeholder="Nombre..."
              />
            </div>
            <div class="field">
              <label for="title">Apellido</label>
              <input pInputText type="text" id="surname" formControlName="surname" placeholder="Apellido..." />
            </div>
            <div class="field">
              <label for="title">Correo electronico</label>
              <input
                pInputText
                required
                autofocus
                id="email"
                type="email"
                formControlName="email"
                placeholder="Correo electronico..."
              />
            </div>
            <div class="field">
              <label for="title">Rol</label>
              <p-dropdown
                formControlName="rol_value"
                [options]="roles"
                optionLabel="label"
                optionValue="value"
                placeholder="Rol..."
              />
            </div>
          </form>
        </div>
      </ng-template>
      <ng-template pTemplate="footer">
        <p-button
          icon="pi pi-times"
          label="Cancelar"
          severity="danger"
          [outlined]="true"
          (onClick)="cancelEditUser($event)"
        />
        <p-button icon="pi pi-refresh" severity="primary" label="Actualizar" [outlined]="true" (onClick)="updateUser()" />
      </ng-template>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EditUserComponent {
  public compareObjectsService: CompareObjectsService = inject(CompareObjectsService);
  public confirmationService: ConfirmationService = inject(ConfirmationService);
  public usersService: UsersService = inject(UsersService);
  public dialogService: DialogService = inject(DialogService);
  public formBuilder: FormBuilder = inject(FormBuilder);

  public roles = [
    { label: "Empleado", value: "employee" },
    { label: "Administrador", value: "administrator" },
    { label: "Invitado", value: "guest" },
  ];

  public formData: FormGroup<any> = this.formBuilder.group({
    id: this.formBuilder.control(""),
    name: this.formBuilder.control("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    surname: this.formBuilder.control("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: this.formBuilder.control("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    rol_value: this.formBuilder.control("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    rol_label: this.formBuilder.control("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  get selectedRoleLabel(): string {
    const selectedValue = this.formData.get("rol_value")?.value;
    const selectedRole = this.roles.find((role) => role.value === selectedValue);
    return selectedRole ? selectedRole.label : "";
  }

  constructor() {
    effect(() => {
      const data = this.dialogService.userDataSig();
      if (data) {
        this.formData.setValue({
          id: data.id,
          name: data.name || "",
          surname: data.surname || "",
          email: data.email || "",
          rol_value: data.rol_value || "",
          rol_label: data.rol_label || "",
        });
      }
    });
  }

  public cancelEditUser(event: Event): void {
    const userData = this.dialogService.userDataSig();
    const formData = this.formData.value;

    if (this.compareObjectsService.compareObjects(formData, userData)) {
      this.dialogService.closeEditUser();
    } else {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Hay cambios sin guardar, ¿Quiere salir?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        acceptIcon: "none",
        acceptLabel: "Salir",
        rejectIcon: "none",
        rejectLabel: "Cancelar",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          this.dialogService.closeEditUser();
        },
      });
    }
  }

  public updateUser(): void {
    const data = {
      ...this.formData.value,
      rol_label: this.selectedRoleLabel,
    };

    this.usersService.updateUser("users-dashboard", data);
  }
}
