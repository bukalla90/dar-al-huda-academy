// src/components/jitsi/jitsi-meeting.tsx
'use client';

import { useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Button } from '@/components/ui/button';
import { X, Maximize, Minimize } from 'lucide-react';

interface MeetingProps {
  roomName: string;
  userName: string;
  onClose: () => void;
}

export function JitsiMeetingComponent({ roomName, userName, onClose }: MeetingProps): React.ReactNode {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  function toggleFullscreen(): void {
    setIsFullscreen(!isFullscreen);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-white/20 hover:bg-white/30 text-white rounded-full"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="bg-red-500/80 hover:bg-red-600 text-white rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <JitsiMeeting
        roomName={roomName}
        userInfo={{
          displayName: userName,
          email: '',
        }}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          hideConferenceSubject: true,
          hideConferenceTimer: true,
          hideParticipantsStats: true,
          toolbarButtons: [
            'microphone',
            'camera',
            'desktop',
            'fullscreen',
            'fodeviceselection',
            'hangup',
            'chat',
            'settings',
            'raisehand',
            'tileview',
          ],
        }}
        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          FILM_STRIP_MAX_HEIGHT: 120,
        }}
        getIFrameRef={(node: HTMLDivElement) => {
          node.style.height = '100%';
          node.style.width = '100%';
        }}
      />
    </div>
  );
}