export type CampaignId =
  | 'save-the-date'
  | 'formal-invitation'
  | 'rsvp-reminder'
  | 'logistics-update'
  | 'day-of-alert'
  | 'thank-you';

export interface Campaign {
  id: CampaignId;
  label: string;
  smsBody: string;
  smsMediaUrl?: string;
  emailTemplate: string;
  priority: 'email' | 'sms' | 'both';
  disabled?: boolean;
}

const COMPLIANCE_FOOTER = 'Yonatan & Saron Wedding: You are subscribed to receive wedding updates. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out.';
const SITE_LINK = 'https://theestifanos.com/?pwd=Matthew19:6';
const PHOTO_STD = 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_3.jpeg';
const PHOTO_INVITE = 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_2.jpeg';

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'save-the-date',
    label: 'Save the Date',
    smsBody: `Save the Date! Yonatan & Saron are getting married on September 4, 2026 in Wrightsville, PA. RSVP at ${SITE_LINK}\n\n${COMPLIANCE_FOOTER}`,
    smsMediaUrl: PHOTO_STD,
    emailTemplate: 'SaveTheDate',
    priority: 'both',
  },
  {
    id: 'formal-invitation',
    label: 'Formal Invitation',
    smsBody: `You are formally invited to the wedding of Yonatan & Saron — September 4, 2026, Wrightsville, PA. RSVP at ${SITE_LINK}\n\n${COMPLIANCE_FOOTER}`,
    smsMediaUrl: PHOTO_INVITE,
    emailTemplate: 'FormalInvite',
    priority: 'both',
    disabled: true,
  },
  {
    id: 'rsvp-reminder',
    label: 'RSVP Deadline Reminder',
    smsBody: `Reminder: Please RSVP for Yonatan & Saron's wedding by June 1st at ${SITE_LINK}\n\n${COMPLIANCE_FOOTER}`,
    smsMediaUrl: PHOTO_STD,
    emailTemplate: 'GenericTemplate',
    priority: 'both',
    disabled: true,
  },
  {
    id: 'logistics-update',
    label: 'Wedding Week Logistics',
    smsBody: `Wedding week details for Yonatan & Saron's wedding are now available! See parking, hotel & schedule at ${SITE_LINK}\n\n${COMPLIANCE_FOOTER}`,
    smsMediaUrl: PHOTO_STD,
    emailTemplate: 'GenericTemplate',
    priority: 'both',
    disabled: true,
  },
  {
    id: 'day-of-alert',
    label: 'Day-of Updates',
    smsBody: `Wedding day update from Yonatan & Saron! Check ${SITE_LINK} for last-minute details.\n\n${COMPLIANCE_FOOTER}`,
    emailTemplate: 'GenericTemplate',
    priority: 'sms',
    disabled: true,
  },
  {
    id: 'thank-you',
    label: 'Thank You',
    smsBody: `Thank you for celebrating with us! — Yonatan & Saron. Visit ${SITE_LINK}\n\n${COMPLIANCE_FOOTER}`,
    smsMediaUrl: PHOTO_STD,
    emailTemplate: 'GenericTemplate',
    priority: 'email',
    disabled: true,
  },
];

export const getCampaign = (id: string): Campaign | undefined => {
  return CAMPAIGNS.find((c) => c.id === id);
};
