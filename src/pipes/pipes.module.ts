import { NgModule } from '@angular/core';
import { ZeroPadPipe } from './zero-pad/zero-pad';
@NgModule({
	declarations: [ZeroPadPipe],
	imports: [],
	exports: [ZeroPadPipe]
})
export class PipesModule {}
