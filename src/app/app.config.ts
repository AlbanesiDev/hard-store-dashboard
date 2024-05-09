import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

import { MessageService } from 'primeng/api';

import { provideFirebase } from "./core/config/firebase.config";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebase, MessageService],
};
