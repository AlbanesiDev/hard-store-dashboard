import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { routes } from "./app.routes";

import { ConfirmationService, MessageService } from "primeng/api";

import { provideFirebase } from "./core/config/firebase.config";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([]), withFetch()),
    provideAnimationsAsync(),
    provideFirebase,
    MessageService,
    ConfirmationService,
  ],
};
