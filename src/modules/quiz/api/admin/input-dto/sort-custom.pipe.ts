import { PipeTransform } from '@nestjs/common';

export type SortParam = {
  field: string;
  sorDirection: 'ASC' | 'DESC';
};

export class SortCustomPipe implements PipeTransform {
  transform(value: string | string[]): SortParam[] {
    if (!value) value = ['avgScores desc', 'sumScore desc'];
    console.log(value);
    const data = Array.isArray(value) ? value : [value];

    const result: SortParam[] = [];

    for (const item of data) {
      const [field, dir] = item.split(' ');

      const sorDirection = dir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      result.push({
        field,
        sorDirection,
      });
    }

    return result;
  }
}
