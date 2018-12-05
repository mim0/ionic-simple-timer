import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroPad',
})
export class ZeroPadPipe implements PipeTransform {

  transform(value: number, size:number) {
    let s = value + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

}
