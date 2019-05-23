/// <reference path="../ui/core/view.d.ts" />

import { EventData, Observable } from 'tns-core-modules/data/observable/observable';
import { ActionBar } from 'tns-core-modules/ui/action-bar/action-bar';
import { ActivityIndicator } from 'tns-core-modules/ui/activity-indicator/activity-indicator';
import { Button } from 'tns-core-modules/ui/button/button';
import { View } from 'tns-core-modules/ui/core/view/view';
import { DatePicker } from 'tns-core-modules/ui/date-picker/date-picker';
import { EditableTextBase, TextBase } from 'tns-core-modules/ui/editable-text-base/editable-text-base';
import { ContainerView, CustomLayoutView, Frame } from 'tns-core-modules/ui/frame/frame';
import { HtmlView } from 'tns-core-modules/ui/html-view/html-view';
import { Image } from 'tns-core-modules/ui/image/image';
import { Label } from 'tns-core-modules/ui/label';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout/absolute-layout';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout/dock-layout';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout/grid-layout';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout/stack-layout';
import { WrapLayout } from 'tns-core-modules/ui/layouts/wrap-layout/wrap-layout';
import { ListPicker } from 'tns-core-modules/ui/list-picker/list-picker';
import { ListView } from 'tns-core-modules/ui/list-view/list-view';
import { Page } from 'tns-core-modules/ui/page/page';
import { Placeholder } from 'tns-core-modules/ui/placeholder/placeholder';
import { Progress } from 'tns-core-modules/ui/progress/progress';
import { Repeater } from 'tns-core-modules/ui/repeater/repeater';
import { ScrollView } from 'tns-core-modules/ui/scroll-view/scroll-view';
import { SearchBar } from 'tns-core-modules/ui/search-bar/search-bar';
import { SegmentedBar } from 'tns-core-modules/ui/segmented-bar/segmented-bar';
import { Slider } from 'tns-core-modules/ui/slider/slider';
import { Switch } from 'tns-core-modules/ui/switch/switch';
import { TabView } from 'tns-core-modules/ui/tab-view/tab-view';
import { TextField } from 'tns-core-modules/ui/text-field/text-field';
import { TextView } from 'tns-core-modules/ui/text-view/text-view';
import { TimePicker } from 'tns-core-modules/ui/time-picker/time-picker';
import { WebView } from 'tns-core-modules/ui/web-view/web-view';
import { isTraceEnabled, writeGlobalEventsTrace } from '../trace';
import { unwrapViewFunction, wrapViewFunction } from './helpers';

export function setupGlobalEventsOnViewClass(ViewClass: any) {
  const viewName = ViewClass.name;
  const obsKeyName = `__a11y_globalEvent_${viewName}_observable`;

  if (ViewClass[obsKeyName]) {
    if (isTraceEnabled()) {
      writeGlobalEventsTrace(`"${viewName}" already overridden`);
    }

    return;
  }

  if (isTraceEnabled()) {
    writeGlobalEventsTrace(`Adding to "${viewName}"`);
  }

  ViewClass[obsKeyName] = new Observable();

  unwrapViewFunction(ViewClass, 'notify');

  wrapViewFunction(ViewClass, 'notify', function customNotify(arg: EventData) {
    if (!ViewClass[obsKeyName].hasListeners(arg.eventName)) {
      return;
    }

    if (isTraceEnabled()) {
      writeGlobalEventsTrace(`Notify "${arg.eventName}" to all "${viewName}" from ${arg.object}`);
    }

    ViewClass[obsKeyName].notify(arg);
  });

  ViewClass.on = ViewClass.addEventListener = function customAddEventListener(eventNames: string, callback: (data: EventData) => void, thisArg?: any) {
    if (isTraceEnabled()) {
      writeGlobalEventsTrace(`On: "${eventNames}" thisArg:${thisArg} to "${viewName}"`);
    }

    ViewClass[obsKeyName].on(eventNames, callback, thisArg);
  };

  ViewClass.once = function customAddOnceEventListener(eventNames: string, callback: (data: EventData) => void, thisArg?: any) {
    if (isTraceEnabled()) {
      writeGlobalEventsTrace(`Once: "${eventNames}" thisArg:${thisArg} to "${viewName}"`);
    }

    ViewClass[obsKeyName].once(eventNames, callback, thisArg);
  };

  ViewClass.off = ViewClass.removeEventListener = function customRemoveEventListener(eventNames: string, callback?: any, thisArg?: any) {
    if (isTraceEnabled()) {
      writeGlobalEventsTrace(`Remove: "${eventNames}" this:${thisArg} from "${viewName}"`);
    }

    ViewClass[obsKeyName].off(eventNames, callback, thisArg);
  };
}

// Add the global events to the View-class before adding it to the sub-classes.
setupGlobalEventsOnViewClass(View);
setupGlobalEventsOnViewClass(TextBase);
setupGlobalEventsOnViewClass(ContainerView);
setupGlobalEventsOnViewClass(LayoutBase);

for (const viewClass of <{ new (): View }[]>[
  AbsoluteLayout,
  ActionBar,
  ActivityIndicator,
  Button,
  CustomLayoutView,
  DatePicker,
  DockLayout,
  EditableTextBase,
  FlexboxLayout,
  Frame,
  GridLayout,
  HtmlView,
  Image,
  Label,
  ListPicker,
  ListView,
  Page,
  Placeholder,
  Progress,
  Repeater,
  ScrollView,
  SearchBar,
  SegmentedBar,
  Slider,
  StackLayout,
  Switch,
  TabView,
  TextField,
  TextView,
  TimePicker,
  WebView,
  WrapLayout,
]) {
  setupGlobalEventsOnViewClass(viewClass);
}
