import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, DividerModule, ConfirmDialogModule],
  template: `
    <div class="sticky top-0 h-screen py-4" style="min-width: 20rem;">
      <div
        class="card flex flex-column justify-content-between w-full h-full"
      >
        <div class="flex flex-column gap-3">
          @for (sections of sidebarItems; track $index) {
            <h2 class="text-lg m-0">{{ sections.title }}</h2>
            <div class="flex flex-column">
              @for (btn of sections.btn; track $index) {
                <p-button
                  styleClass="w-full text-left"
                  severity="secondary"
                  [text]="true"
                  [icon]="btn.icon"
                  [label]="btn.label"
                  [routerLink]="btn.link"
                />
              }
            </div>
          }
        </div>

        <div class="flex flex-column gap-2">
          <p-divider />
          <p-button
            styleClass="w-full"
            severity="danger"
            icon="pi pi-power-off"
            label="Cerrar sesión"
            [outlined]="true"
            (onClick)="signOut()"
          />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private router = inject(Router);
  public confirmationService = inject(ConfirmationService);
  public messageService = inject(MessageService);
  public authService = inject(AuthService);

  public sidebarItems = [
    {
      title: "Inicio",
      btn: [{ label: "Dashboard", icon: "pi pi-home", link: "dashboard/inicio" }],
    },
    {
      title: "Productos",
      btn: [{ label: "Agregar productos", icon: "pi pi-box", link: "dashboard/productos" }],
    },
  ];

  public signOut(): void {
    this.confirmationService.confirm({
      message: "¿Seguro que quieres cerrar la sesión?",
      header: "¿Cerrar sesión?",
      icon: "pi pi-exclamation-triangle",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Cerrar sesión",
      rejectLabel: "Cancelar",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.messageService.add({
          severity: "info",
          summary: "Desconectado",
          detail: "Se ha cerrado la sesión",
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigateByUrl("/iniciar-sesion");
        }, 250);
        this.authService.signOut();
        this.authService.userAuthSig.set(false);
      },
    });
  }
}
