"use client";

import { MaterialIcon } from "./MaterialIcon";

export function MessageIcon({ type, size = "text-sm", isFan = false }: { type: string; size?: string; isFan?: boolean }) {
  if (isFan) {
    switch (type) {
      case "photo":
        return <MaterialIcon name="photo_camera" className={`text-cyan-400 ${size}`} filled />;
      case "video":
        return <MaterialIcon name="videocam" className={`text-cyan-400 ${size}`} filled />;
      default:
        return <MaterialIcon name="groups" className={`text-cyan-400 ${size}`} filled />;
    }
  }

  switch (type) {
    case "photo":
      return <MaterialIcon name="photo_camera" className={`text-primary ${size}`} filled />;
    case "video":
      return <MaterialIcon name="videocam" className={`text-primary ${size}`} filled />;
    case "result":
      return <MaterialIcon name="emoji_events" className={`text-primary ${size}`} filled />;
    case "status":
      return <MaterialIcon name="flag" className={`text-accent ${size}`} filled />;
    case "sponsor":
      return <MaterialIcon name="handshake" className={`text-emerald-400 ${size}`} filled />;
    default:
      return <MaterialIcon name="chat" className={`text-primary ${size}`} filled />;
  }
}
