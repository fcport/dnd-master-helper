import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideRedux} from "@reduxjs/angular-redux";
import {store} from "./store";
import {provideAnimations} from "@angular/platform-browser/animations";

import {provideTransloco} from '@jsverse/transloco';

import {TranslocoHttpLoader} from './TranslocoHttpLoader';
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideAnimations(),
    provideRouter(routes),
    provideRedux({store}),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'it'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    })],

};
