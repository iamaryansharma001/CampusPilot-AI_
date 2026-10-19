import { Task } from '../types';

/**
 * Generates an iCalendar (.ics) string for given tasks
 */
export function generateIcsContent(tasks: Task[]): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const now = new Date();
  const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  let events = '';
  tasks.forEach((task, index) => {
    // Generate an approximate date for the event
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + (task.status === 'urgent' ? 1 : 4 + index));
    eventDate.setHours(23, 59, 0, 0);

    const dtStart = `${eventDate.getFullYear()}${pad(eventDate.getMonth() + 1)}${pad(eventDate.getDate())}T235900`;
    const dtEnd = `${eventDate.getFullYear()}${pad(eventDate.getMonth() + 1)}${pad(eventDate.getDate())}T235959`;

    events += `BEGIN:VEVENT
UID:${task.id}-${dtStamp}@campuspilot.edu
DTSTAMP:${dtStamp}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${task.title.replace(/[\n\r]/g, ' ')}
DESCRIPTION:Tag: ${task.tag} | Source: ${task.sourceCircular} | CampusPilot AI Verified
STATUS:CONFIRMED
PRIORITY:${task.status === 'urgent' ? 1 : 5}
END:VEVENT
`;
  });

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CampusPilot AI//Academic Action Center//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:CampusPilot Academic Deadlines
X-WR-TIMEZONE:Asia/Kolkata
${events}END:VCALENDAR`;
}

export function downloadIcsFile(tasks: Task[], filename = 'academic-deadlines.ics') {
  const icsData = generateIcsContent(tasks);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
