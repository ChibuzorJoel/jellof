import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Array<Notification & { id: number; visible: boolean }> = [];
  private notificationId = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(notification => {
      this.showNotification(notification);
    });
  }

  private showNotification(notification: Notification): void {
    const id = ++this.notificationId;
    const notificationWithId = {
      ...notification,
      id,
      visible: true
    };

    this.notifications.push(notificationWithId);

    // Auto-hide after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      this.hideNotification(id);
    }, duration);
  }

  hideNotification(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.visible = false;
      // Remove from array after animation
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 300);
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  }
}