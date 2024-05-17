import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { ConfirmationService, MessageService } from "primeng/api";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";

import { DialogService } from "../../../../../core/services/dialog.service";
import { UsersService } from "../../../../../core/services/users.service";
import { AuthService } from "../../../../../core/services/auth.service";
import { CompareObjectsService } from "../../../../../core/services/compare-objects.service";

@Component({
  selector: "app-add-user",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    PasswordModule,
    DropdownModule,
  ],
  template: `
    <p-dialog
      class="p-fluid"
      header="Agregar usuario"
      [modal]="true"
      [style]="{ width: '32rem', height: '35rem' }"
      [draggable]="false"
      [(visible)]="dialogService.createUser"
    >
      <ng-template pTemplate="content">
        <div class="flex justify-content-center mt-2">
          <form autocomplete="off" [formGroup]="formData">
            <div class="formgrid grid">
              <div class="field col">
                <label for="name">Nombre</label>
                <input
                  pInputText
                  autofocus
                  type="text"
                  id="name"
                  name="name"
                  formControlName="name"
                  placeholder="Nombre..."
                />
              </div>
              <div class="field col">
                <label for="surname">Apellido</label>
                <input
                  pInputText
                  type="text"
                  id="surname"
                  name="surname"
                  formControlName="surname"
                  placeholder="Apellido..."
                />
              </div>
            </div>
            <div class="formgrid grid">
              <div class="field col">
                <label for="email">Correo electronico</label>
                <input
                  pInputText
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="off"
                  formControlName="email"
                  placeholder="Correo electronico..."
                />
              </div>
              <div class="field col">
                <label for="password">Contraseña</label>
                <p-password
                  inputId="password"
                  autocomplete="new-password"
                  formControlName="password"
                  placeholder="Contraseña..."
                  [feedback]="false"
                />
              </div>
            </div>

            <div class="field">
              <label for="rol">Rol</label>
              <p-dropdown
                id="rol"
                name="rol"
                inputId="rol"
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
          (onClick)="cancelCreateUser($event)"
        />
        <p-button icon="pi pi-plus" severity="primary" label="Agregar" [outlined]="true" (onClick)="addUser()" />
      </ng-template>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddUserComponent {
  public compareObjectsService: CompareObjectsService = inject(CompareObjectsService);
  public confirmationService: ConfirmationService = inject(ConfirmationService);
  public dialogService: DialogService = inject(DialogService);
  public usersService: UsersService = inject(UsersService);
  public authService: AuthService = inject(AuthService);
  public formBuilder: FormBuilder = inject(FormBuilder);
  public messageService: MessageService = inject(MessageService);

  public roles = [
    { label: "Empleado", value: "employee" },
    { label: "Administrador", value: "administrator" },
    { label: "Invitado", value: "guest" },
  ];

  public formData: FormGroup<any> = this.formBuilder.group({
    name: this.formBuilder.control("", {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
    surname: this.formBuilder.control("", {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
    email: this.formBuilder.control("", {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control("", {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
    rol_value: this.formBuilder.control("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  get selectedRoleLabel(): string {
    const selectedValue = this.formData.get("rol_value")?.value;
    const selectedRole = this.roles.find((role) => role.value === selectedValue);
    return selectedRole ? selectedRole.label : "";
  }

  public cancelCreateUser(event: Event): void {
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


  public addUser(): void {
    if (this.formData.valid) {
      const data = {
        ...this.formData.value,
        rol_label: this.selectedRoleLabel,
      };
      try {
        this.authService.registerWithEmail("users-dashboard", data);
        this.dialogService.closeCreateUser();
        this.messageService.add({
          severity: "success",
          summary: "¡Éxito!",
          detail: "El usuario se ha creado correctamente.",
        });
      } catch {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Error al crear el usuario",
        });
      }
    }
  }
}
