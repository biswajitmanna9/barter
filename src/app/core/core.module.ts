import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { NgSelectModule } from '@ng-select/ng-select';
//===========================services===============================//
import { PostService } from './services/post.service';
import { LoginService } from './services/login.service';
import { DefaultInterceptorService } from './services/default-interceptor.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from './services/message.service';
//===========================guard===============================//
import { AuthGuard } from './guard/auth.guard';


// Material
import {
  MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule,
  MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule,
  MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatStepperIntl, MatRadioModule, MatRippleModule, MatFormFieldModule, MatSelectModule,
  MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule,
  MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatStepperModule,
} from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
//===========================components===============================//
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { ViewConversationComponent } from './components/view-conversation/view-conversation.component';
import { ConversationRatingComponent } from './components/conversation-rating/conversation-rating.component';

export function httpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    AngularFontAwesomeModule,
    Ng2ImgMaxModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      apiKey: 'AIzaSyB3FKbaqonmY-bDPanbzJSH9U7HXF8dpS4'
      // apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw'
    }),
    AgmJsMarkerClustererModule,
    NgSelectModule,
    //----------------Material----------------//
    MatAutocompleteModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule, MatDatepickerModule,
    MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule,
    MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatFormFieldModule, MatSelectModule, MatSidenavModule,
    MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule,
    MatTabsModule, MatToolbarModule, MatTooltipModule, NgxMatSelectSearchModule
    //----------------Material----------------//
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LeftPanelComponent,
    LoadingComponent,
    ConversationComponent,
    ViewConversationComponent,
    ConversationRatingComponent
  ],
  exports: [
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AngularFontAwesomeModule,
    Ng2ImgMaxModule,
    HeaderComponent,
    FooterComponent,
    LeftPanelComponent,
    LoadingComponent,
    AgmCoreModule,
    AgmJsMarkerClustererModule,
    NgSelectModule,
    //----------------Material----------------//
    MatAutocompleteModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule, MatDatepickerModule,
    MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule,
    MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatFormFieldModule, MatSelectModule, MatSidenavModule,
    MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule,
    MatTabsModule, MatToolbarModule, MatTooltipModule, NgxMatSelectSearchModule
    //----------------Material----------------//
  ],
  entryComponents: [
    ConversationComponent,
    ViewConversationComponent,
    ConversationRatingComponent
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        PostService,
        LoginService,
        AuthGuard,
        CookieService,
        MessageService,
        // {
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: DefaultInterceptorService,
        //   multi: true,
        // },
      ]
    };
  }
}
