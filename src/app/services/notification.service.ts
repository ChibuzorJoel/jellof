import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$: Observable<Notification> = this.notificationSubject.asObservable();

  constructor() {}

  /**
   * Show success notification
   */
  success(message: string, duration: number = 5000): void {
    this.show({
      type: 'success',
      message,
      duration
    });
  }

  /**
   * Show error notification
   */
  error(message: string, duration: number = 7000): void {
    this.show({
      type: 'error',
      message,
      duration
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, duration: number = 5000): void {
    this.show({
      type: 'warning',
      message,
      duration
    });
  }

  /**
   * Show info notification
   */
  info(message: string, duration: number = 5000): void {
    this.show({
      type: 'info',
      message,
      duration
    });
  }

  /**
   * Show notification
   */
  private show(notification: Notification): void {
    this.notificationSubject.next(notification);
  }
}