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
        path: "gestionar-productos",
        title: "Dashboard | Gestionar productos",
        loadComponent: () => import("./dashboard/sections/products/products.component"),
      },
      {
        path: "banners",
        title: "Dashboard | Banners",
        loadComponent: () => import("./dashboard/sections/banners/banners.component"),
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
