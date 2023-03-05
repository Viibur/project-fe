import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {JuhendModalComponent} from './juhend-modal/juhend-modal.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { VigaLynkComponent } from './viga-lynk/viga-lynk.component';
import { VigaKirjutaComponent } from './viga-kirjuta/viga-kirjuta.component';

@NgModule({
  declarations: [
    AppComponent,
    JuhendModalComponent,
    VigaLynkComponent,
    VigaKirjutaComponent
  ],
  imports: [
    NgbModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
