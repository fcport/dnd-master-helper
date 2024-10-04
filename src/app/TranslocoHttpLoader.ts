import {inject, Injectable} from '@angular/core';
import {Translation, TranslocoLoader} from '@jsverse/transloco';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {

    let pathToLangs: string;

    if (this.isElectron()) {
      const electron = (window as any).require('electron');
      const path = electron.remote.require('path');
      const app = electron.remote.app;
      pathToLangs = path.join(app.getAppPath(), 'assets', 'i18n', `${lang}.json`);
    } else {
      pathToLangs = `assets/i18n/${lang}.json`;
    }

    return this.http.get<Translation>(pathToLangs);
  }

  private isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}
