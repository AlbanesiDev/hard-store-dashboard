import { Routes } from "@angular/router";
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from "@angular/fire/auth-guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard/inicio",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    ...canActivate(() => redirectUnauthorizedTo(["auth/iniciar-sesion"])),
    children: [
      {
        path: "",
        redirectTo: "inicio",
        pathMatch: "full",
      },
      {
        path: "inicio",
        title: "Dashboard | Inicio",
        loadComponent: () => import("./dashboard/dashboard.component"),
      },
      {
        path: "productos",
        title: "Dashboard | Productos",
        loadComponent: () => import("./dashboard/sections/products/products.component"),
      },
    ],
  },
  {
    path: "auth",
    ...canActivate(() => redirectLoggedInTo(["dashboard/inicio"])),
    children: [
      {
        path: "recuperar-contrasena",
        title: "Recuperar Contraseña",
        loadComponent: () => import("./auth/forgot/forgot.component"),
      },
      {
        path: "iniciar-sesion",
        title: "Iniciar Sesión",
        loadComponent: () => import("./auth/sign-in/sign-in.component"),
      },
    ],
  },
  {
    path: "**",
    title: "Dashboard | Iniciar Sesión",
    ...canActivate(() => redirectLoggedInTo(["dashboard/inicio"])),
    loadComponent: () => import("./auth/sign-in/sign-in.component"),
  },
];
