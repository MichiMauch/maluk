"use client";

import { MaterialIcon } from "./MaterialIcon";

export function MessageIcon({ type, size = "text-sm" }: { type: string; size?: string }) {
  switch (type) {
    case "photo":
      return <MaterialIcon name="photo_camera" className={`text-primary ${size}`} filled />;
    case "video":
      return <MaterialIcon name="videocam" className={`text-primary ${size}`} filled />;
    case "result":
      return <MaterialIcon name="emoji_events" className={`text-primary ${size}`} filled />;
    case "status":
      return <MaterialIcon name="flag" className={`text-accent ${size}`} filled />;
    default:
      return <MaterialIcon name="chat" className={`text-primary ${size}`} filled />;
  }
}
