import {
  APP_INITIALIZER,
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideRedux} from '@reduxjs/angular-redux';
import {store} from './store';
import {provideAnimations} from '@angular/platform-browser/animations';

import {provideTransloco} from '@jsverse/transloco';

import {TranslocoHttpLoader} from './TranslocoHttpLoader';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {firstValueFrom, tap} from "rxjs";


import {inject} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';

export function loadTranslationsFactory(): () => Promise<void> {
  const translocoService = inject(TranslocoService);

  return () =>
    new Promise<void>((resolve, reject) => {
      translocoService.load('en').subscribe({
        next: () => {
          console.log('Traduzioni caricate');
          resolve(); // Risolve la Promise quando le traduzioni sono caricate
        },
        error: (err) => {
          console.error('Errore nel caricamento delle traduzioni', err);
          reject(err); // Rifiuta la Promise in caso di errore
        },
      });
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadTranslationsFactory,
      multi: true, // Indica che è un initializer multiplo
    },

    provideRouter(routes),
    provideRedux({store}),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'it'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
