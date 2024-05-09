import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, ConfirmDialogModule, SidebarComponent],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast />
    <p-confirmDialog />
    <div class="flex gap-4">
      @if (router.url.startsWith("/dashboard")) {
        <app-sidebar />
      }
      <div class="w-full py-4 pr-4">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AppComponent {
  public router = inject(Router);
}
