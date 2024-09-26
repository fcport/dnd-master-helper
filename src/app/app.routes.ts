import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'ask-question',
    loadComponent: () => import('./components/ask-question/ask-question.component').then(m => m.AskQuestionComponent)
  },
  {
    path: 'document-loader',
    loadComponent: () => import('./components/document-loader/document-loader.component').then(m => m.DocumentLoaderComponent)
  },
  {
    path: 'support-me',
    loadComponent: () => import('./components/support-me/support-me.component').then(m => m.SupportMeComponent)
  }
];
