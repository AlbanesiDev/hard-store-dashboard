import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { TableControlsComponent } from "../../../components/table-controls/table-controls.component";
import { UsersService } from "../../../core/services/users.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DialogService } from "../../../core/services/dialog.service";
import { TableComponent } from "../../../components/table/table.component";
import { AddUserComponent } from "./abm/add-user/add-user.component";
import { EditUserComponent } from "./abm/edit-user/edit-user.component";
import { AuthService } from "../../../core/services/auth.service";

export interface TableUi {
  isProduct: boolean;
  title: string;
  currentPage: string;
  filter: string[];
  th: any[];
}

@Component({
  standalone: true,
  imports: [CommonModule, TableControlsComponent, TableComponent, AddUserComponent, EditUserComponent],
  template: `
    <app-add-user />
    <app-edit-user />
    <div class="flex flex-column gap-4">
      <app-table-controls
        [disabledDeleteSig]="disabledDeleteSig()"
        (createDataOut)="createUser()"
        (deleteDataOut)="deleteMultipleUsers()"
        (importDataOut)="importUsers()"
        (exportDataOut)="exportUsers()"
      />
      <app-table
        [data]="usersSig()"
        [tableUi]="uiData[0]"
        (editDataOut)="editUser($event)"
        (deleteDataOut)="deleteUser($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersDashboardComponent implements OnInit {
  public dialogService: DialogService = inject(DialogService);
  public usersService: UsersService = inject(UsersService);
  public authService: AuthService = inject(AuthService);
  public destroyRef: DestroyRef = inject(DestroyRef);

  uiData: TableUi[] = [
    {
      isProduct: false,
      title: "Gestionar usuarios del dashboard",
      currentPage: "Usuarios",
      filter: ["uid", "name", "surname", "email"],
      th: [
        { column_name: "Nombre", pSortableColumn: "name", value: "name" },
        { column_name: "Apellido", pSortableColumn: "surname", value: "surname" },
        { column_name: "Correo electronico", pSortableColumn: "email", value: "email" },
        { column_name: "Rol", pSortableColumn: "rol_value", value: "rol_label" },
      ],
    },
  ];

  public usersSig = signal<any>([]);
  public disabledDeleteSig = signal<boolean>(true);

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService
      .getUsers("users-dashboard")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.usersSig.set(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  createUser(): void {
    this.dialogService.openCreateUser();
  }

  editUser(data: any): void {
    this.dialogService.setUserData(data);
    this.dialogService.openEditUser();
  }

  deleteUser(data: any) {
    this.authService
    this.usersService.deleteUser("users-dashboard", data);
  }

  deleteMultipleUsers() {}

  importUsers() {
    console.log("se importo");
  }
  exportUsers() {
    console.log("se exporto");
  }
}
