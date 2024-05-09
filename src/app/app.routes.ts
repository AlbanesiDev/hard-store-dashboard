import { Routes } from "@angular/router";
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from "@angular/fire/auth-guard";

export const routes: Routes = [
  {
    path: "",
    title: "Dashboard",
    ...canActivate(() => redirectUnauthorizedTo(["auth/sign-in"])),
    loadComponent: () => import("./dashboard/dashboard.component"),
  },
  {
    path: "dashboard",
    title: "Dashboard",
    ...canActivate(() => redirectUnauthorizedTo(["auth/iniciar-sesion"])),
    loadComponent: () => import("./dashboard/dashboard.component"),
  },
  {
    path: "auth",
    ...canActivate(() => redirectLoggedInTo(["dashboard"])),
    children: [
      {
        path: "forgot",
        title: "Recuperar Contraseña",
        loadComponent: () => import("./auth/forgot/forgot.component"),
      },
      {
        path: "iniciar-sesion",
        title: "Iniciar Sesión",
        loadComponent: () => import("./auth/sign-in/sign-in.component")
      },
    ],
  },
  {
    path: "**",
    title: "Dashboard | Iniciar Sesión",
    ...canActivate(() => redirectLoggedInTo(["dashboard"])),
    loadComponent: () => import("./auth/sign-in/sign-in.component")
  },
];
