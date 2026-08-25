import { useEffect, useRef } from 'react';
import useAuthenticationStateStore from '../../../Store/AuthenticationStateStore';
import TanstackQueryClientService from '../../../Services/TanstackQueryClientService';
import ApplicationSoundService from '../../../Services/ApplicationSoundService';
import { NotificationItemType } from '../../../Types/NotificationType';

/**
 * Global hook that monitors incoming enterprise notifications during 15s auto-polling
 * and triggers NotificationSound.mp3 when newly arrived notifications are detected.
 */
export default function useNotificationSoundWatcher(): void {
  const user = useAuthenticationStateStore((state) => state.user);

  const { data: notifications = [] } =
    TanstackQueryClientService.current.notifications.useNotificationsQuery(
      user?.id,
      user?.role
    );

  const knownIdsRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!notifications || notifications.length === 0) {
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
      }
      return;
    }

    // Initial mount/load: record existing IDs without triggering audio
    if (!isInitializedRef.current) {
      knownIdsRef.current = new Set(notifications.map((n: NotificationItemType) => n.id));
      isInitializedRef.current = true;
      return;
    }

    // Check for newly arriving unread notification IDs
    const newArrivals = notifications.filter(
      (n: NotificationItemType) => !knownIdsRef.current.has(n.id) && !n.isRead
    );

    // Update known IDs registry
    notifications.forEach((n: NotificationItemType) => knownIdsRef.current.add(n.id));

    // Play sound if any new incoming notifications were detected during polling
    if (newArrivals.length > 0) {
      ApplicationSoundService.current.playNotificationSound();
    }
  }, [notifications]);
}
