// ─── Component: Premium Vector Iconica Icons ───
// Pixel-perfect, high-precision SVG vector icons with customizable stroke, size, and glowing accents.

import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Svg, {Path, Circle, Rect, Polyline, Line, Polygon, G} from 'react-native-svg';
import {colors} from '../../theme';

export type IconName =
  | 'home'
  | 'compass'
  | 'briefcase'
  | 'book-open'
  | 'award'
  | 'graduation-cap'
  | 'check-square'
  | 'check-circle'
  | 'check'
  | 'user'
  | 'users'
  | 'user-plus'
  | 'user-check'
  | 'user-x'
  | 'bell'
  | 'bell-ring'
  | 'git-branch'
  | 'cpu'
  | 'server'
  | 'sparkles'
  | 'zap'
  | 'plus'
  | 'x'
  | 'trash'
  | 'edit'
  | 'search'
  | 'filter'
  | 'arrow-right'
  | 'arrow-left'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'chevron-up'
  | 'shield'
  | 'shield-check'
  | 'lock'
  | 'key'
  | 'smartphone'
  | 'mail'
  | 'phone'
  | 'clock'
  | 'calendar'
  | 'dollar-sign'
  | 'trending-up'
  | 'activity'
  | 'bar-chart'
  | 'video'
  | 'play'
  | 'image'
  | 'eye'
  | 'eye-off'
  | 'log-out'
  | 'building'
  | 'send'
  | 'alert-triangle'
  | 'info'
  | 'refresh-cw'
  | 'code'
  | 'target'
  | 'camera'
  | 'wifi-off'
  | 'download'
  | 'file-text'
  | 'layers'
  | 'sliders'
  | 'external-link';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: ViewStyle;
}

export const Icon = React.memo(function Icon({
  name,
  size = 20,
  color = colors.neutral[100],
  strokeWidth = 2,
  style,
}: IconProps) {
  const renderPaths = () => {
    switch (name) {
      case 'home':
        return (
          <>
            <Path
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Polyline
              points="9 22 9 12 15 12 15 22"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'compass':
        return (
          <>
            <Circle
              cx="12"
              cy="12"
              r="10"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Polygon
              points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={color + '33'}
            />
          </>
        );

      case 'briefcase':
        return (
          <>
            <Rect
              x="2"
              y="7"
              width="20"
              height="14"
              rx="2"
              ry="2"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'book-open':
        return (
          <>
            <Path
              d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'award':
        return (
          <>
            <Circle
              cx="12"
              cy="8"
              r="7"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Polyline
              points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'graduation-cap':
        return (
          <>
            <Path
              d="M22 10v6M2 10l10-5 10 5-10 5z"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M6 12v5c3 3 9 3 12 0v-5"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'check-square':
        return (
          <>
            <Polyline
              points="9 11 12 14 22 4"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'check-circle':
        return (
          <>
            <Path
              d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Polyline
              points="22 4 12 14.01 9 11.01"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'check':
        return (
          <Polyline
            points="20 6 9 17 4 12"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'user':
        return (
          <>
            <Path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle
              cx="12"
              cy="7"
              r="4"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
          </>
        );

      case 'users':
        return (
          <>
            <Path
              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle
              cx="9"
              cy="7"
              r="4"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Path
              d="M23 21v-2a4 4 0 0 0-3-3.87"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M16 3.13a4 4 0 0 1 0 7.75"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'user-plus':
        return (
          <>
            <Path
              d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle
              cx="8.5"
              cy="7"
              r="4"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Line
              x1="20"
              y1="8"
              x2="20"
              y2="14"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="23"
              y1="11"
              x2="17"
              y2="11"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        );

      case 'user-check':
        return (
          <>
            <Path
              d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle
              cx="8.5"
              cy="7"
              r="4"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Polyline
              points="17 11 19 13 23 9"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'user-x':
        return (
          <>
            <Path
              d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle
              cx="8.5"
              cy="7"
              r="4"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Line
              x1="18"
              y1="8"
              x2="22"
              y2="12"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="22"
              y1="8"
              x2="18"
              y2="12"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        );

      case 'bell':
      case 'bell-ring':
        return (
          <>
            <Path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'git-branch':
        return (
          <>
            <Line
              x1="6"
              y1="3"
              x2="6"
              y2="15"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="18"
              cy="6"
              r="3"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx="6"
              cy="18"
              r="3"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Path
              d="M18 9a9 9 0 0 1-9 9"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'cpu':
        return (
          <>
            <Rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="2"
              ry="2"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Rect
              x="9"
              y="9"
              width="6"
              height="6"
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Line x1="9" y1="1" x2="9" y2="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="15" y1="1" x2="15" y2="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="9" y1="20" x2="9" y2="23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="15" y1="20" x2="15" y2="23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="20" y1="9" x2="23" y2="9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="20" y1="14" x2="23" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="1" y1="9" x2="4" y2="9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="1" y1="14" x2="4" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        );

      case 'server':
        return (
          <>
            <Rect x="2" y="2" width="20" height="8" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Rect x="2" y="14" width="20" height="8" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Line x1="6" y1="6" x2="6.01" y2="6" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
            <Line x1="6" y1="18" x2="6.01" y2="18" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
          </>
        );

      case 'sparkles':
        return (
          <>
            <Path
              d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={color + '33'}
            />
            <Path
              d="M19 16l1.2 2.8L23 20l-2.8 1.2L19 24l-1.2-2.8L15 20l2.8-1.2z"
              stroke={color}
              strokeWidth={1.5}
              fill="none"
            />
          </>
        );

      case 'zap':
        return (
          <Polygon
            points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color + '33'}
          />
        );

      case 'plus':
        return (
          <>
            <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        );

      case 'x':
        return (
          <>
            <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        );

      case 'trash':
        return (
          <>
            <Polyline points="3 6 5 6 21 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'edit':
        return (
          <>
            <Path
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'search':
        return (
          <>
            <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        );

      case 'filter':
        return (
          <Polygon
            points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'arrow-right':
        return (
          <>
            <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Polyline points="12 5 19 12 12 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'arrow-left':
        return (
          <>
            <Line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Polyline points="12 19 5 12 12 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'chevron-right':
        return (
          <Polyline
            points="9 18 15 12 9 6"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'chevron-left':
        return (
          <Polyline
            points="15 18 9 12 15 6"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'chevron-down':
        return (
          <Polyline
            points="6 9 12 15 18 9"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'chevron-up':
        return (
          <Polyline
            points="18 15 12 9 6 15"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'shield':
      case 'shield-check':
        return (
          <>
            <Path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={name === 'shield-check' ? color + '22' : 'none'}
            />
            {name === 'shield-check' && (
              <Polyline
                points="9 12 11 14 15 10"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </>
        );

      case 'lock':
        return (
          <>
            <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'key':
        return (
          <>
            <Path
              d="M21 2l-2 2m-1.5 1.5L14 9l-2-2 2-2-4.5-4.5a7 7 0 1 0-7 9.9 7 7 0 0 0 9.9 0L21 2z"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle cx="7.5" cy="16.5" r="1.5" fill={color} />
          </>
        );

      case 'smartphone':
        return (
          <>
            <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Line x1="12" y1="18" x2="12.01" y2="18" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
          </>
        );

      case 'mail':
        return (
          <>
            <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Polyline points="22,6 12,13 2,6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'phone':
        return (
          <Path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'clock':
        return (
          <>
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Polyline points="12 6 12 12 16 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'calendar':
        return (
          <>
            <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth={strokeWidth} />
          </>
        );

      case 'dollar-sign':
        return (
          <>
            <Line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Path
              d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'trending-up':
        return (
          <>
            <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="17 6 23 6 23 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'activity':
        return (
          <Polyline
            points="22 12 18 12 15 21 9 3 6 12 2 12"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'bar-chart':
        return (
          <>
            <Line x1="12" y1="20" x2="12" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="18" y1="20" x2="18" y2="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="6" y1="20" x2="6" y2="16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        );

      case 'video':
        return (
          <>
            <Polygon points="23 7 16 12 23 17 23 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={color + '33'} />
            <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
          </>
        );

      case 'play':
        return (
          <Polygon
            points="5 3 19 12 5 21 5 3"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
          />
        );

      case 'image':
        return (
          <>
            <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
            <Polyline points="21 15 16 10 5 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'eye':
        return (
          <>
            <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} fill="none" />
          </>
        );

      case 'eye-off':
        return (
          <>
            <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        );

      case 'log-out':
        return (
          <>
            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="16 17 21 12 16 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        );

      case 'building':
        return (
          <>
            <Path d="M4 22h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="10" y1="6" x2="10.01" y2="6" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
            <Line x1="14" y1="6" x2="14.01" y2="6" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
            <Line x1="10" y1="10" x2="10.01" y2="10" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
            <Line x1="14" y1="10" x2="14.01" y2="10" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
            <Line x1="10" y1="14" x2="10.01" y2="14" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
            <Line x1="14" y1="14" x2="14.01" y2="14" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
          </>
        );

      case 'send':
        return (
          <>
            <Line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Polygon points="22 2 15 22 11 13 2 9 22 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'alert-triangle':
        return (
          <>
            <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
          </>
        );

      case 'info':
        return (
          <>
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="12" y1="8" x2="12.01" y2="8" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" />
          </>
        );

      case 'refresh-cw':
        return (
          <>
            <Polyline points="23 4 23 10 17 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="1 20 1 14 7 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'code':
        return (
          <>
            <Polyline points="16 18 22 12 16 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="8 6 2 12 8 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'target':
        return (
          <>
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth={strokeWidth} fill="none" />
            <Circle cx="12" cy="12" r="2" fill={color} />
          </>
        );

      case 'camera':
        return (
          <>
            <Path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={strokeWidth} fill="none" />
          </>
        );

      case 'wifi-off':
        return (
          <>
            <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M10.71 5.05A16 16 0 0 1 22.58 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="12" y1="20" x2="12.01" y2="20" stroke={color} strokeWidth={strokeWidth + 1} strokeLinecap="round" strokeLinejoin="round" />
          </>
        );

      case 'download':
        return (
          <>
            <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="7 10 12 15 17 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </>
        );

      case 'file-text':
        return (
          <>
            <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="14 2 14 8 20 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="10 9 9 9 8 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'layers':
        return (
          <>
            <Polygon points="12 2 2 7 12 12 22 7 12 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="2 17 12 22 22 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="2 12 12 17 22 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'sliders':
        return (
          <>
            <Line x1="4" y1="21" x2="4" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="4" y1="10" x2="4" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="12" y1="21" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="12" y1="8" x2="12" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="20" y1="21" x2="20" y2="16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="20" y1="12" x2="20" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="1" y1="14" x2="7" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="9" y1="8" x2="15" y2="8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="17" y1="16" x2="23" y2="16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </>
        );

      case 'external-link':
        return (
          <>
            <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="15 3 21 3 21 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="10" y1="14" x2="21" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </>
        );

      default:
        return (
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} fill="none" />
        );
    }
  };

  return (
    <View style={[styles.container, {width: size, height: size}, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {renderPaths()}
      </Svg>
    </View>
  );
});

export interface IconPillProps {
  name: IconName;
  label?: string;
  size?: number;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  style?: ViewStyle;
}

export const IconBadge = React.memo(function IconBadge({
  name,
  size = 16,
  iconColor = colors.accent[400],
  backgroundColor = colors.surface.elevated,
  borderColor = colors.border.subtle,
  style,
}: IconPillProps) {
  const badgeSize = size + 14;
  return (
    <View
      style={[
        styles.badge,
        {
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
          backgroundColor,
          borderColor,
        },
        style,
      ]}>
      <Icon name={name} size={size} color={iconColor} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
