export type CampaignId =
  | 'formal-invitation'
  | 'rsvp-reminder'
  | 'logistics-update'
  | 'day-of-alert'
  | 'thank-you';

export interface Campaign {
  id: CampaignId;
  label: string;
  smsBody: string;
  emailTemplate: string;
  priority: 'email' | 'sms' | 'both';
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'formal-invitation',
    label: 'Formal Invitation',
    smsBody: 'You are invited to Yonatan & Saron\'s wedding! RSVP at theestifanos.com',
    emailTemplate: 'FormalInvite',
    priority: 'both',
  },
  {
    id: 'rsvp-reminder',
    label: 'RSVP Deadline Reminder',
    smsBody: 'Reminder: Please RSVP for Yonatan & Saron\'s wedding by June 1st at theestifanos.com',
    emailTemplate: 'GenericTemplate',
    priority: 'both',
  },
  {
    id: 'logistics-update',
    label: 'Wedding Week Logistics',
    smsBody: 'Wedding logistics update! See parking, hotel & schedule details at theestifanos.com',
    emailTemplate: 'GenericTemplate',
    priority: 'both',
  },
  {
    id: 'day-of-alert',
    label: 'Day-of Updates',
    smsBody: 'Wedding day update: Shuttle leaving in 10 mins from hotel lobby!',
    emailTemplate: 'GenericTemplate',
    priority: 'sms',
  },
  {
    id: 'thank-you',
    label: 'Thank You',
    smsBody: 'Thank you for celebrating with us! View photos at theestifanos.com/photos',
    emailTemplate: 'GenericTemplate',
    priority: 'email',
  },
];

export const getCampaign = (id: string): Campaign | undefined => {
  return CAMPAIGNS.find((c) => c.id === id);
};
