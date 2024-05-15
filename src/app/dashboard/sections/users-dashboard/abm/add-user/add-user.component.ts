import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, InjectFlags, inject } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { DialogService } from "../../../../../core/services/dialog.service";

@Component({
  selector: "app-add-user",
  standalone: true,
  imports: [CommonModule, DialogModule],
  template: `
    <p-dialog
      class="p-fluid"
      [modal]="true"
      [style]="{ width: '700px', }"
      [(visible)]="dialogService.createUser"
    >
    <div class="card">

    </div>
  </p-dialog>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent {
  public dialogService: DialogService = inject(DialogService);
}
