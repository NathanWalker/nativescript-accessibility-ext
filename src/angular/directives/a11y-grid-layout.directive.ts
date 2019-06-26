import { Directive, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout/grid-layout';
import { A11YFontScalingObservable, a11yFontScalingToken } from '../data/font-scaling';
import { BaseService } from '../services/base.service';

@Directive({
  selector: 'GridLayout[a11yRows], GridLayout[a11yColumns]',
})
export class A11YGridLayoutDirective extends BaseService implements OnInit {
  private readonly rows$ = new BehaviorSubject<string>(null);
  @Input('a11yRows')
  public set rows(a11yRows: string) {
    this.rows$.next(`${a11yRows}`);
  }
  public get rows() {
    return this.rows$.value;
  }

  private readonly columns$ = new BehaviorSubject<string>(null);
  @Input('a11yColumns')
  public set columns(a11yColumns: string) {
    this.columns$.next(`${a11yColumns}`);
  }
  public get columns() {
    return this.columns$.value;
  }

  constructor(private el: ElementRef<GridLayout>, @Inject(a11yFontScalingToken) private readonly fontScaling$: A11YFontScalingObservable) {
    super();
  }

  public ngOnInit() {
    combineLatest(this.rows$, this.fontScaling$)
      .pipe(
        map(([rows, fontScale]) => this.fixValue(rows, fontScale)),
        filter((rows) => !!rows),
        this.takeUntilDestroy(),
      )
      .subscribe((rows) => (this.el.nativeElement['rows'] = rows));

    combineLatest(this.columns$, this.fontScaling$)
      .pipe(
        map(([columns, fontScale]) => this.fixValue(columns, fontScale)),
        filter((columns) => !!columns),
        this.takeUntilDestroy(),
      )
      .subscribe((columns) => (this.el.nativeElement['columns'] = columns));
  }

  private fixValue(str: string, fontScale: number) {
    if (!str) {
      return null;
    }

    return str
      .split(',')
      .map((part) => part.trim().toLowerCase())
      .filter((part) => !!part)
      .map((part) => {
        switch (part) {
          case '*':
          case 'auto': {
            return part;
          }
          default: {
            return Number(part) * fontScale;
          }
        }
      })
      .join(', ');
  }
}
