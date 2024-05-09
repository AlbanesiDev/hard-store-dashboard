import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";


import { routes } from "./app.routes";

import { ConfirmationService, MessageService } from "primeng/api";

import { provideFirebase } from "./core/config/firebase.config";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebase, MessageService, ConfirmationService],
};
