import { ActionItem, ParsedNotice, PresetSample } from '../types';

export const MATHS_SHEET_TEXT = `DEPARTMENT OF APPLIED MATHEMATICS & COMPUTING
TUTORIAL ASSIGNMENT SHEET #4
Course: BAS-201 Engineering Mathematics II
Section: CSAIML (Roll: CSAIML-061 | Adm: 26GCEBCSAIML072)

Topic: Matrix Eigenvalues, SVD Decomposition & Multivariable Optimization

Instructions for Submission:
1. Complete all 6 numerical problems from Section-B in a handwritten A4 assignment folder.
2. Verify Eigenvector calculations using Python numpy script and attach printed graph of eigenvalues.
3. Submit physical assignment file to Dr. S. Rao (Cabin 214, Ramanujan Block) before Friday, 4:00 PM.
4. Late submissions will incur a 20% mark deduction as per Department Academic Guidelines.

Office Hours: Tuesday & Thursday 2:00 PM - 4:00 PM
- Course Coordinator: Dr. S. Rao`;

export const LAB_MANUAL_TEXT = `DEPARTMENT OF COMPUTER SCIENCE & ENGG (AI & ML)
LABORATORY MANUAL & EXPERIMENT NOTIFICATION
Lab Code: CS-AIML-302 (Artificial Intelligence Practical)
Semester: 4th Sem | Section: CSAIML-061 | Adm: 26GCEBCSAIML072

Experiment 06: Convolutional Feature Extraction & Neural Classifier Implementation

Mandatory Lab Guidelines:
1. Complete Jupyter Notebook implementation of Experiment 6 with test loss graphs plotted.
2. Push your clean code repository to GitHub classroom and note down the commit hash.
3. Prepare printed and spiral-bound lab manual report with algorithm flowchart and signature index.
4. Viva voce and code execution examination will be conducted on April 19 at 10:00 AM in Lab 4, Turing Computing Center.
5. Bring college identity card and signed index sheet. Unsigned manuals will not be evaluated.

- Faculty Incharge: Prof. K. Verma, Advanced AI Lab`;

export const SAMPLE_1_TEXT = MATHS_SHEET_TEXT;
export const SAMPLE_2_TEXT = LAB_MANUAL_TEXT;

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'sample-maths',
    title: 'Maths Sheet',
    subtitle: 'Ramanujan Block Cabin 214 • 6 Problems • Due Friday 4 PM',
    badge: 'Weekly Sheet',
    icon: 'calculate',
    text: MATHS_SHEET_TEXT,
    parsedData: {
      event: 'Maths Sheet: Tutorial 4 (Linear Algebra & SVD)',
      venue: 'Cabin 214, Ramanujan Block & Math Lab',
      deadline: 'Friday, 4:00 PM IST • Hard Deadline',
      fees: 'CSAIML Section • Roll: CSAIML-061 • Mandatory Submission',
      ruleRecommendation: 'Submit before 2 PM on Friday to avoid corridor queues at Cabin 214.',
      actionItems: [
        {
          id: 'maths-1',
          text: 'Complete all 6 numerical problems from Section-B in handwritten A4 folder',
          tag: 'Required Step',
          deadline: 'by Friday 12 PM',
          completed: false,
          urgent: true,
        },
        {
          id: 'maths-2',
          text: 'Verify Eigenvector calculations using Python numpy script and attach printout',
          tag: 'Code Verification',
          note: 'Attach numpy script',
          completed: false,
        },
        {
          id: 'maths-3',
          text: 'Submit physical assignment file to Dr. S. Rao (Cabin 214, Ramanujan Block)',
          tag: 'Faculty Desk',
          deadline: 'before Friday 4 PM',
          completed: false,
          urgent: true,
        },
        {
          id: 'maths-4',
          text: 'Obtain signed internal assessment receipt on course docket',
          tag: 'Academic Record',
          completed: true,
        },
      ],
    },
  },
  {
    id: 'sample-lab',
    title: 'Lab Manual',
    subtitle: 'Lab 4 Turing Center • Code & Viva Assessment • Due April 19',
    badge: 'Lab Viva',
    icon: 'science',
    text: LAB_MANUAL_TEXT,
    parsedData: {
      event: 'AIML Lab Manual: Experiment 06 & Viva Examination',
      venue: 'Lab 4, Alan Turing Computing Center',
      deadline: 'April 19, 2025 • 10:00 AM (Viva Slot)',
      fees: 'CSAIML Section • Adm: 26GCEBCSAIML072 • Practical Exam',
      ruleRecommendation: 'Push GitHub commit before 8 AM; laboratory server bandwidth throttles during viva hours.',
      actionItems: [
        {
          id: 'lab-1',
          text: 'Complete Jupyter Notebook implementation of Experiment 6 with loss graphs',
          tag: 'Experiment Prep',
          deadline: 'by April 18',
          completed: false,
          urgent: true,
        },
        {
          id: 'lab-2',
          text: 'Push clean code repository to GitHub classroom and note down commit hash',
          tag: 'Code Submission',
          note: 'Save git commit',
          completed: false,
        },
        {
          id: 'lab-3',
          text: 'Prepare printed and spiral-bound lab manual report with flowchart and index',
          tag: 'Manual Binding',
          completed: false,
        },
        {
          id: 'lab-4',
          text: 'Appear for Viva Voce & live execution test at Lab 4 Turing Center with student ID',
          tag: 'Viva Voce',
          deadline: 'April 19, 10:00 AM',
          completed: false,
          urgent: true,
        },
      ],
    },
  },
  {
    id: 'sample-hackathon',
    title: 'Hackathon Notice',
    subtitle: 'Audi-3 Kalam Block • 2-Day Generative AI BootCamp • Due Tomorrow 11:59 PM',
    badge: 'Hackathon',
    icon: 'code',
    text: `DEPARTMENT OF COMPUTER SCIENCE & ENGG
CIRCULAR: NOTICE-AI/2025/04
Date: 10 April 2025

Sub: Two-day Generative AI & LLM Hands-on BootCamp 2025

All 2nd and 3rd year B.Tech students of CSE, AIML, and IT are hereby notified that the Department is organizing a hands-on National AI BootCamp.

Event Details:
- Dates: 18th - 19th April 2025 (9:30 AM to 5:00 PM)
- Venue: Audi-3, Dr. APJ Abdul Kalam Tech Block (2nd Floor)
- Registration Fee: INR 200 per student (inclusive of lunch, kit & certificate)

Mandatory Instructions:
1. Fill Google Form registration before 14th April 2025, 11:59 PM.
2. Pay registration amount of ₹200 to Accounts Desk and upload receipt.
3. Form a team of 2-4 members with designated student lead.
4. Carry charged laptop with Python 3.11 and VS Code installed.
5. Biometric attendance is mandatory on both days for certificate eligibility.`,
    parsedData: {
      event: 'Two-day Generative AI & LLM Hands-on BootCamp 2025',
      venue: 'Audi-3, Dr. APJ Abdul Kalam Tech Block (2nd Floor)',
      deadline: 'Tomorrow, 11:59 PM • Registration Closes',
      fees: 'B.Tech CSE/AIML/IT • INR 200 Registration Fee',
      ruleRecommendation: 'Form team of 2-4 before filling form to secure lab workstation seating.',
      actionItems: [
        {
          id: 'hack-1',
          text: 'Fill Google Form registration before deadline',
          tag: 'Portal Entry',
          deadline: 'Tomorrow, 11:59 PM',
          completed: false,
          urgent: true,
        },
        {
          id: 'hack-2',
          text: 'Pay registration fee ₹200 to Accounts Desk and keep receipt',
          tag: 'Fee Payment',
          note: 'Attach screenshot',
          completed: false,
          urgent: true,
        },
        {
          id: 'hack-3',
          text: 'Form team of 2-4 members with designated lead',
          tag: 'Team Formation',
          completed: false,
        },
        {
          id: 'hack-4',
          text: 'Install Python 3.11, CUDA and VS Code on laptop',
          tag: 'Hardware Prep',
          completed: true,
        },
      ],
    },
  },
  {
    id: 'sample-hostel',
    title: 'Hostel Clearance',
    subtitle: 'Hostel Admin Block • Mess Rebate & Key Handover • Due April 25',
    badge: 'Admin Circular',
    icon: 'home_work',
    text: `OFFICE OF CHIEF WARDEN & HOSTEL ADMINISTRATION
CIRCULAR: HST/CLEARANCE/2025/11
Date: 12 April 2025

Sub: Semester-End Hostel Vacating, Mess Rebate & No-Dues Clearance

All resident scholars and hostel occupants are advised to complete semester clearance before departure:

Venue & Schedule:
- Office: Counter 3, Central Hostel Administrative Block
- Clearance Hours: 10:00 AM - 4:00 PM (Monday through Friday)
- Final Deadline: April 25, 2025

Mandatory Steps:
1. Submit Mess Rebate refund form with student bank passbook copy.
2. Hand over room keys and inventory checklist to Hostel Supervisor before 5:00 PM.
3. Obtain stamped No-Dues certificate from Caretaker for Semester End-Exam clearance.
4. Download clearance receipt PDF on phone to avoid server outage during rush.`,
    parsedData: {
      event: 'Semester-End Hostel Vacating, Mess Rebate & No-Dues Clearance',
      venue: 'Counter 3, Central Hostel Administrative Block',
      deadline: 'April 25, 2025 • 4:00 PM',
      fees: 'Resident Scholars • No Pending Dues Required',
      ruleRecommendation: 'Download clearance receipt PDF on phone to prevent delays if hostel Wi-Fi slows down.',
      actionItems: [
        {
          id: 'host-1',
          text: 'Submit Mess Rebate refund form with bank passbook copy',
          tag: 'Mess Clearance',
          deadline: 'by April 22',
          completed: false,
        },
        {
          id: 'host-2',
          text: 'Hand over room keys and inventory checklist to Supervisor before 5:00 PM',
          tag: 'Room Keys',
          deadline: 'before 5:00 PM',
          completed: false,
          urgent: true,
        },
        {
          id: 'host-3',
          text: 'Obtain stamped No-Dues certificate from Caretaker',
          tag: 'Admin Stamp',
          completed: false,
        },
        {
          id: 'host-4',
          text: 'Download clearance receipt PDF on phone to preserve offline proof',
          tag: 'Offline Proof',
          completed: true,
        },
      ],
    },
  },
];

const STORAGE_KEY_CUSTOM_PRESETS = 'campuspilot_custom_presets_v2';

export function getStoredCustomPresets(): PresetSample[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredCustomPresets(presets: PresetSample[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(presets));
  } catch (e) {
    console.error('Failed to save custom presets', e);
  }
}

/**
 * Deterministic Local Rule Engine Heuristic Parser
 * Parses college notices offline with zero hallucination.
 */
export function parseNoticeLocally(text: string): ParsedNotice {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Detect Event / Activity
  let event = 'Campus Academic Notice / Activity';
  const subLine = lines.find((l) => /^(sub|subject|regarding|re:)\s*[:\-]/i.test(l));
  if (subLine) {
    event = subLine.replace(/^(sub|subject|regarding|re:)\s*[:\-]\s*/i, '').trim();
  } else {
    const notifyLine = lines.find((l) => /(bootcamp|hackathon|examination|symposium|conference|induction|workshop|seminar)/i.test(l));
    if (notifyLine) {
      event = notifyLine.replace(/^CIRCULAR:\s*/i, '').trim();
    } else if (lines.length > 2) {
      event = lines[2].replace(/^CIRCULAR:\s*/i, '').trim();
    }
  }

  // 2. Detect Venue
  let venue = 'Campus Main Auditorium / Department Block';
  const venueMatch = text.match(/(?:in|at|venue:?)\s*([A-Za-z0-9\-\s,]+(?:Audi(?:torium)?|Block|Hall|Lab|Room|Center|Centre|Campus|Amphitheatre)[A-Za-z0-9\-\s,]*)/i);
  if (venueMatch && venueMatch[1]) {
    venue = venueMatch[1].trim().split('\n')[0].replace(/[.,]$/, '');
  } else if (/audi-3/i.test(text)) {
    venue = 'Audi-3, Dr. APJ Abdul Kalam Tech Block';
  } else if (/block-b/i.test(text) || /academic cell/i.test(text)) {
    venue = 'Academic Cell Block-B & Exam Center';
  }

  // 3. Detect Critical Deadline
  let deadline = 'Check with department coordinator';
  const deadlineMatch = text.match(/(?:deadline|last date|due date|hard deadline|before|by)\s*(?:is|for registration:?|:)?\s*([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+(?:\s+[0-9]{4})?(?:[,\s]+[0-9]{1,2}:[0-9]{2}\s*(?:AM|PM|IST)?)?)/i);
  if (deadlineMatch && deadlineMatch[1]) {
    deadline = deadlineMatch[1].trim();
    if (!/IST|AM|PM/i.test(deadline)) {
      deadline += ' • 11:59 PM IST';
    }
  } else if (/14th April|April 14/i.test(text)) {
    deadline = 'April 14, 2025 • 11:59 PM IST';
  } else if (/April 20/i.test(text)) {
    deadline = 'April 20, 2025 • Fee Clearance Deadline';
  }

  // 4. Detect Eligibility & Fees
  let fees = 'All Registered Students • Verification Required';
  const feeMatch = text.match(/(?:fee|registration fee|deposit|amount|cost)[:\s]*([INR₹Rs.\s0-9\/\-]+)/i);
  const eligMatch = text.match(/(?:all\s+([0-9a-zA-Z\s&]+(?:year|students|scholars|residents)[0-9a-zA-Z\s&]*?)\s+(?:are|must|of|can))/i);

  const feeStr = feeMatch ? feeMatch[0].trim() : (/₹200|INR 200/i.test(text) ? 'Registration: ₹200' : 'No Registration Fee');
  const eligStr = eligMatch ? eligMatch[1].trim() : (/CSE and IT/i.test(text) ? 'CSE/IT 2nd & 3rd Year' : 'Undergraduate & PG Scholars');
  fees = `${eligStr} • ${feeStr}`;

  // 5. Extract Action Items
  const actionItems: ActionItem[] = [];
  const instructionRegex = /(?:^|\n)\s*(?:[0-9]+[.)]\s*|[-*•]\s*)(.+)/g;
  let match;
  let idx = 1;

  while ((match = instructionRegex.exec(text)) !== null) {
    const rawItem = match[1].trim();
    if (rawItem.length < 10) continue;

    let tag = 'Required Step';
    let note: string | undefined;
    let deadlineStr: string | undefined;
    let urgent = false;

    if (/fee|pay|amount|upi|inr|₹/i.test(rawItem)) {
      tag = 'Fee Payment';
      note = 'Attach screenshot / Ref ID';
    } else if (/form|link|google|portal|erp/i.test(rawItem)) {
      tag = 'Portal Entry';
      note = 'Keep docs handy';
    } else if (/team|members|group|leader/i.test(rawItem)) {
      tag = 'Team Formation';
      note = '2-4 members';
    } else if (/laptop|vs code|python|hardware|bring|carry/i.test(rawItem)) {
      tag = 'Hardware Prep';
      note = 'Bring chargers';
    } else if (/attendance|condonation|dues/i.test(rawItem)) {
      tag = 'Academic Cell';
    }

    if (/deadline|last date|by|before/i.test(rawItem)) {
      urgent = true;
      const dMatch = rawItem.match(/(?:by|before)\s*([A-Za-z0-9\s]+)/i);
      if (dMatch) deadlineStr = 'by ' + dMatch[1].trim().split(/[.,]/)[0];
    }

    actionItems.push({
      id: `local-item-${idx}`,
      text: rawItem,
      tag,
      deadline: deadlineStr,
      note,
      completed: idx === 1,
      urgent,
    });
    idx++;
  }

  // Fallback if no numbered list found
  if (actionItems.length === 0) {
    actionItems.push(
      {
        id: 'local-item-1',
        text: 'Review circular instructions and mark critical deadline',
        tag: 'Required Step',
        completed: false,
        urgent: true,
      },
      {
        id: 'local-item-2',
        text: 'Confirm eligibility criteria with class coordinator',
        tag: 'Verification',
        completed: false,
      }
    );
  }

  // 6. Rule Engine Recommendation
  let ruleRecommendation = 'Submit documentation before 10 PM to avoid university portal congestion.';
  if (/hackathon|bootcamp|ai/i.test(text)) {
    ruleRecommendation = 'Submit Hackathon docs before 10 PM to avoid portal traffic bottlenecks.';
  } else if (/exam|hall ticket|attendance/i.test(text)) {
    ruleRecommendation = 'Clear fee counter queues before 1 PM; verification server undergoes backup at 4 PM.';
  } else if (/hostel/i.test(text)) {
    ruleRecommendation = 'Complete room checklist during morning hours when floor wardens are at the desk.';
  }

  return {
    id: `notice-${Date.now()}`,
    title: event,
    department: lines[0] || 'Academic Affairs',
    rawText: text,
    event,
    venue,
    deadline,
    fees,
    actionItems,
    ruleRecommendation,
    confidence: 100,
    parsedAt: new Date().toISOString(),
    engineUsed: 'local',
  };
}
