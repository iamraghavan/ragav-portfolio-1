export type DigitalAsset = {
  slug: string; title: string; category: 'Web templates' | 'Marketing' | 'Design assets';
  access: 'Free' | 'Paid'; format: string; description: string; includes: string[];
  download?: string; preview: 'website' | 'planner' | 'social'; instructions: string;
};

export const digitalAssets: DigitalAsset[] = [
  {slug: 'studio-landing-page', title: 'Studio landing page', category: 'Web templates', access: 'Free', format: 'HTML + CSS',
    description: 'A clean, responsive starting point for a freelancer or small creative studio. One file, easy to customise.',
    includes: ['Responsive hero, services and contact sections', 'Embedded CSS with editable colour variables', 'No frameworks, external fonts or dependencies'],
    download: '/downloads/studio-landing-page.html', preview: 'website', instructions: 'Download the HTML file and open it in your browser. Edit the text, colours and contact email in any text editor before publishing.'},
  {slug: 'content-calendar', title: 'Weekly content planner', category: 'Marketing', access: 'Free', format: 'CSV',
    description: 'Plan a week of content with space for channels, goals, calls to action and publishing status.',
    includes: ['Seven editable example content ideas', 'Columns for date, channel, copy, owner and status', 'Works with Excel, Google Sheets and other CSV editors'],
    download: '/downloads/weekly-content-planner.csv', preview: 'planner', instructions: 'Import the CSV into your spreadsheet app. Replace the example ideas with your own, set publication dates and assign an owner to each post.'},
  {slug: 'social-announcement', title: 'Social announcement card', category: 'Design assets', access: 'Free', format: 'SVG · 1080 × 1080',
    description: 'An editable square announcement design with bold typography and a warm, minimal colour palette.',
    includes: ['One scalable 1080 × 1080 SVG design', 'Editable text, shapes and colours', 'No linked images or external assets'],
    download: '/downloads/social-announcement.svg', preview: 'social', instructions: 'Open the SVG in a vector editor, replace the sample brand and announcement, and export a PNG for social media. Font appearance may vary between editors.'},
  {slug: 'growth-website-kit', title: 'Growth website kit', category: 'Web templates', access: 'Paid', format: 'Planned · Next.js',
    description: 'A planned website starter for service businesses, with room for services, projects and enquiry journeys.',
    includes: ['Planned: reusable page sections', 'Planned: project and service layouts', 'Planned: setup and customisation guide'],
    preview: 'website', instructions: 'This is a concept preview. The paid kit is not available for purchase or download yet. Final contents and pricing will be announced at launch.'},
  {slug: 'campaign-planning-bundle', title: 'Campaign planning bundle', category: 'Marketing', access: 'Paid', format: 'Planned · Spreadsheets',
    description: 'A planned collection for campaign briefs, advertising budgets and performance reporting.',
    includes: ['Planned: campaign brief template', 'Planned: budget and creative testing trackers', 'Planned: campaign reporting sheets'],
    preview: 'planner', instructions: 'This is a concept preview. The bundle is coming soon; final contents and pricing are not yet set.'},
  {slug: 'social-brand-kit', title: 'Social brand kit', category: 'Design assets', access: 'Paid', format: 'Planned · SVG collection',
    description: 'A planned family of coordinated designs for announcements, quotes and promotional posts.',
    includes: ['Planned: coordinated social layouts', 'Planned: editable typography and colour styles', 'Planned: export and usage guide'],
    preview: 'social', instructions: 'This is a concept preview. The complete collection is coming soon; final contents and pricing will be shared at launch.'},
];
