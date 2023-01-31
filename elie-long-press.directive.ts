/* ----------------------------------------------------
 * 👨‍💻 Created By   : Elie G Kassouf
 * 📬 Email (work) : elie@jobsite360.com
 * 📪 Email (home) : elie.kassouf@gmail.com
 * 📱 Phone (work) : 1 (902) 213-7812
 * ☎️ Phone (home) : 1 (647) 453-9954
 * 🌐 Website URL  : https://eliekassouf.herokuapp.com
 * ----------------------------------------------------
 * 🗓️ Last Revised : Monday, January 30th 2023
 * ----------------------------------------------------
 * #️⃣ Version: 3.1.0
 * ----------------------------------------------------
 * ℹ️ Controller Details
 * ----------------------------------------------------
 *
 * Elie Long Press Directive for Angular
 *
 * The directive will detect long press events on
 * touch devices and on desktop devices.
 *
 * The directive will emit an event when the user
 * holds the touch or mouse down for a certain amount
 * of time.
 *
 * The directive can also emit continuously
 * after certain amount by pressing/touching.
 * RxJS is used to make this happen.
 *
 * Keep this directive simple and easy to use. Meaning
 * the actual logic of the long press should be
 * handled in the component that uses this directive.
 *
 * ----------------------------------------------------
 * ©️ 2018-2023 Elie G Kassouf
 * ----------------------------------------------------
 */












import { Directive, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { switchMap, takeUntil, tap } from "rxjs/operators";
import { timer, Subject, Subscription } from "rxjs";












@Directive({
  selector: '[elieLongPress]'
})
export class ElieLongPressDirective
  implements OnInit, OnDestroy {












  /**
   * ## ⬇️ Inputs
   * - <b>elieLongPressThreshold</b> - The amount of time in milliseconds that the user must hold the touch or mouse down before the long press event is fired.
   * - <b>elieLongPressIntervalDuration</b> - The amount of time in milliseconds that the user must hold the touch or mouse down before the long press event is fired.
   * - <b>elieLongPressContinuousFiring</b> - If set to true, the long press event will be fired continuously after a certain amount of time <b>elieLongPressThreshold</b>.
   * - <b>elieLongPressIsTouchDevice</b> - If set to true, the directive will only detect long press events on touch devices.
   */
  @Input() elieLongPressThreshold: number = 500;
  @Input() elieLongPressIntervalDuration: number = 1000;
  @Input() elieLongPressContinuousFiring: boolean = false;
  @Input() elieLongPressIsTouchDevice: boolean = ('ontouchstart' in document.documentElement);












  /**
   * ## ⬆️ Outputs
   * - <b>elieLongPressEvent</b> - The long press event that will be fired when the user holds the touch or mouse down for a certain amount of time <b>elieLongPressThreshold</b>.
   * - <b>elieLongPressContinuousEvent</b> - The long press event that will be fired continuously after a certain amount of time <b>elieLongPressThreshold</b>.
   */
  @Output() elieLongPressEvent: EventEmitter<TouchEvent | MouseEvent> = new EventEmitter();
  @Output() elieLongPressContinuousEvent = new EventEmitter();












  /**
   * ## ⚙️ Directive Temporary Variables
   * - <b>touchStartTimeout</b> - The timeout that will be used to detect the long press event.
   * - <b>continuousPressSubscription</b> - The subscription that will be used to detect the continuous long press event.
   * - <b>continuousPressStart</b> - The subject that will be used to start the continuous long press event.
   * - <b>continuousPressStop</b> - The subject that will be used to stop the continuous long press event.
   */
  private touchStartTimeout: NodeJS.Timeout | null = null;
  private continuousPressSubscription: Subscription | null = null;
  private readonly continuousPressStart = new Subject<void>();
  private readonly continuousPressStop = new Subject<void>();












  /**
  * ## ❌ Stop Continuous Fire/Press
  */
  private stop():void {

    // Stop Continuous Fire
    if (this.elieLongPressContinuousFiring) {
      this.continuousPressStop.next();
      return;
    }

    // Clear Long Press Timeout
    if (this.touchStartTimeout != null)
      clearTimeout(this.touchStartTimeout);

  }












  /**
   * ## 👆 Touch Events
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(
    touchEvent: TouchEvent
  ): void {

    // Cancel if Non Touch Device
    if (!this.elieLongPressIsTouchDevice)
      return;

    // Continuous Firing
    if (this.elieLongPressContinuousFiring) {
      this.continuousPressStart.next();
      return;
    }

    // Long Press Timeout
    this.touchStartTimeout = setTimeout(() => {
      this.elieLongPressEvent.emit(touchEvent);
    }, this.elieLongPressThreshold);

  }
  @HostListener('touchend') onTouchEnd():void { this.stop(); }
  @HostListener('touchcancel') onTouchCancel():void { this.stop(); }












  /**
   * ## 🐁 Mouse Events
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(
    mouseEvent: MouseEvent
  ): void {

    // Cancel If Touch Device
    if (this.elieLongPressIsTouchDevice)
      return;

    // Continuous Firing - Left Button Only
    if (this.elieLongPressContinuousFiring && mouseEvent.button === 0) {
      this.continuousPressStart.next();
      return;
    }

    // Long Press Timeout
    this.touchStartTimeout = setTimeout(() => {
      this.elieLongPressEvent.emit(mouseEvent);
    }, this.elieLongPressThreshold);

  }
  @HostListener('mousemove') onMouseMove() { this.stop(); }
  @HostListener('mouseup') onMouseUp() { this.stop(); }












  /**
   * ## ▶️ Directive Initializing
   *
   * ##ℹ️ Details:
   * - Initialize the directive...
   * - Initialize the continuous press event subscription.
   *
   * @remarks Add complex logic details to the <b>Details</b> list above and remember to make sure your code is revised, tested and works. Clean code is a must! Check Readme file for more details.
   */
  ngOnInit() {
    this.continuousPressSubscription =
      this.continuousPressStart
        .pipe(
          tap(() => {
            // Start the continuous press event
            // Do something here if you really need to.
          }),
          switchMap(() =>
            timer(
              this.elieLongPressThreshold,
              this.elieLongPressIntervalDuration
            ).pipe(
              takeUntil(this.continuousPressStop.pipe(tap(() => {
                // End the continuous press event
                // Do something here if you really need to.
                // Use the default (click) event for this.
              })))
            )
          )
        )
        .subscribe(tick => this.elieLongPressContinuousEvent.emit());
  }












  /**
   * ## ⚠️ Directive Destroyed
   *
   * ##ℹ️ Details:
   * - Destroy the directive...
   *
   * @remarks Add complex logic details to the <b>Details</b> list above and remember to make sure your code is revised, tested and works. Clean code is a must! Check Readme file for more details.
   */
  ngOnDestroy() {
    if (this.continuousPressSubscription != null)
      this.continuousPressSubscription.unsubscribe();
  }












}
