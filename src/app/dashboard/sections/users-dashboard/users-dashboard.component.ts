import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { TableControlsComponent } from "../../../components/table-controls/table-controls.component";
import { UsersService } from "../../../core/services/users.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DialogService } from "../../../core/services/dialog.service";
import { TableComponent } from "../../../components/table/table.component";
import { AddUserComponent } from "./abm/add-user/add-user.component";

export interface TableUi {
  isProduct: boolean;
  title: string;
  currentPage: string;
  filter: string[];
  th: any[];
}

@Component({
  standalone: true,
  imports: [CommonModule, TableControlsComponent, TableComponent, AddUserComponent],
  template: `
    <app-add-user />
    <div class="flex flex-column gap-4">
      <app-table-controls
        [disabledDeleteSig]="disabledDeleteSig()"
        (createDataOut)="createUser()"
        (deleteDataOut)="deleteUser()"
        (exportDataOut)="importUsers()"
        (importDataOut)="exportUsers()"
      />
      <app-table [data]="usersSig()" [tableUi]="uiData[0]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersDashboardComponent implements OnInit {
  public dialogService = inject(DialogService);
  public usersService = inject(UsersService);
  public destroyRef = inject(DestroyRef);

  uiData: TableUi[] = [
    {
      isProduct: false,
      title: "Gestionar usuarios del dashboard",
      currentPage: "Usuarios",
      filter: ["uid", "name", "surname", "email"],
      th: [
        { column_name: "Nombre", pSortableColumn: "name", width: "" },
        { column_name: "Apellido", pSortableColumn: "surname", width: "" },
        { column_name: "Correo electronico", pSortableColumn: "email", width: "" },
        { column_name: "Rol", pSortableColumn: "rol", width: "" },
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

  createUser() {
    this.dialogService.openCreateUser();
  }
  deleteUser() {
    console.log("se elimino");
  }
  importUsers() {
    console.log("se importo");
  }
  exportUsers() {
    console.log("se exporto");
  }
}
