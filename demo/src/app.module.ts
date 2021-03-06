import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from '@nativescript/angular/nativescript.module';
import { getRootView } from '@nativescript/core/application/application';
import * as trace from '@nativescript/core/trace';
import { NotaAccessibilityExtModule } from '@nota/nativescript-accessibility-ext/angular';
import { categories } from '@nota/nativescript-accessibility-ext/trace';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

trace.setCategories(categories.FontScale);
trace.enable();

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from '@nativescript/angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from '@nativescript/angular/http-client';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [NativeScriptModule, AppRoutingModule, NotaAccessibilityExtModule],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}

global['rootView'] = getRootView();
