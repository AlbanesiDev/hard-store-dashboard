import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { PasswordModule } from "primeng/password";
import { InputTextModule } from "primeng/inputtext";
import { AutoFocusModule } from "primeng/autofocus";

import { MessageService } from "primeng/api";

import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-signIn",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    PasswordModule,
    InputTextModule,
    AutoFocusModule,
  ],
  template: `
    <div class="flex justify-content-center align-items-start w-full h-screen px-4 py-8">
      <div class="w-30rem border-1 border-round surface-border surface-card shadow-6 px-4 md:px-6 py-8">
        <form [formGroup]="signInForm" (keydown.enter)="this.signInWithEmailClick()">
          <h2 class="text-4xl mt-0 mb-6">Iniciar Sesión</h2>
          <div class="flex flex-column justify-content-between gap-4">
            <div class="flex flex-column justify-content-between gap-5">
              <div>
                <span class="w-full p-float-label mb-2">
                  <input
                    pInputText
                    pAutoFocus
                    type="text"
                    id="email"
                    name="email"
                    class="w-full h-3rem"
                    formControlName="email"
                    autocomplete="email"
                    [autofocus]="true"
                  />
                  <label for="email">Correo Electronico</label>
                </span>
                @if (signInForm.get("email")?.invalid && signInForm.get("email")?.touched) {
                  <small class="p-error block" *ngIf="signInForm.get('email')?.errors?.['required']">
                    Correo electronico requerido.
                  </small>
                  <small class="p-error block" *ngIf="signInForm.get('email')?.errors?.['email']"
                    >Correo electronico invalido.</small
                  >
                }
              </div>
              <div>
                <span class="w-full p-float-label mb-2">
                  <p-password
                    type="password"
                    inputId="password"
                    name="password"
                    class="w-full h-3rem"
                    formControlName="password"
                    autocomplete="current-password"
                    [toggleMask]="true"
                    [feedback]="false"
                    [style]="{ width: '100%' }"
                    [inputStyle]="{ width: '100%', height: '3rem' }"
                  ></p-password>
                  <label for="password">Contraseña</label>
                </span>
                @if (signInForm.get("password")?.invalid && signInForm.get("password")?.touched) {
                  <small class="p-error block" *ngIf="signInForm.get('password')?.errors?.['required']">
                    Contraseña requerida.
                  </small>
                }
              </div>
            </div>
            <p-button class="align-self-end" label="¿Olvidaste tu contraseña?" [link]="true" />
            <p-button styleClass="w-full h-3rem" label="Iniciar Sesión" (onClick)="signInWithEmailClick()" />
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignInComponent {
  public router: Router = inject(Router);
  public formBuilder: FormBuilder = inject(FormBuilder);
  public authService: AuthService = inject(AuthService);
  public messageService: MessageService = inject(MessageService);

  /**
   * The form group that holds the signIn form controls and validators.
   */
  public signInForm: FormGroup<any> = this.formBuilder.group({
    email: this.formBuilder.control("", {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  /**
   * Handles the signIn action when the user clicks the signIn button.
   */
  public signInWithEmailClick(): void {
    if (this.signInForm.valid) {
      this.authService.signInWithEmail(this.signInForm.value as { email: string; password: string }).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: `¡Sesión exitosa!`,
            life: 5000,
          }),
            this.router.navigateByUrl("/chat");
        },
        error: (err: any) => {
          console.log(err.message);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: `${err.message}`,
            life: 5000,
          });
        },
      });
    } else {
      this.signInForm.markAllAsTouched();
    }
  }
}
