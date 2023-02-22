# Elie's Angular Long Press Directive
- ℹ️ Long Press/Continuous Press Directive for Angular.
- #️⃣ Created for Angular 15 and above.


## How to use

- elieLongPressEvent emits <TouchEvent | MouseEvent>.
- elieLongPressContinuousEvent does not pass any params.

```html
<div
  elieLongPress
  [elieLongPressContinuousFiring]="false"
  (elieLongPressContinuousEvent)="elieLongPressConstantEvent()"
  (elieLongPressEvent)="elieLongPressEvent($event)">
</div>
```
