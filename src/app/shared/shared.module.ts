import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./material/material.module";
import { ShellComponent } from "./shell/shell.component";

@NgModule({
  declarations: [ShellComponent],
  imports: [CommonModule, MaterialModule],
  exports: [MaterialModule, ShellComponent],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
