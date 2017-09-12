import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ArrayFilterPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'filter',
  pure: false
})
export class ArrayFilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: Array<any>, conditions: { [field: string]: any }): Array<any> {
    return items.filter(item => {
      for (let field in conditions) {
        if (item[field] !== conditions[field]) {
          return false;
        }
      }
      return true;
    });
  }
}
