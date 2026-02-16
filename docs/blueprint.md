# **App Name**: Sentinel Mbare

## Core Features:

- Stock Entry: Allows CHMs to input stock levels for core services via a Stock Entry Modal, seeding the app with initial data.
- Hotspot Locator: Enables CHMs to upload a Hotspot Locator Excel file, parsing GPS coordinates and Wards to create map nodes.
- Peer Activity Sync: Processes the Peers Aggregate Form to extract service data (e.g., condoms distributed), deducts from Firestore stock, and maps reach stats to hotspot coordinates.
- Digital Hotspot Register: Enables PEs to directly enter new KPs (Key Populations), automatically generating a UIN (Unique Identification Number) and calculating 3rd meeting verification.
- Real-time Service Tracking: PEs select service topics from a dropdown to deduct stock immediately, removing paper forms. Includes Topic 10 (ART) and HIVST (HIV Self-Testing) as options.
- Risk Assessment Engine: Transforms the Risk Assessment Tool worksheet into an interactive module. It then provides an automatically-assigned score. The app will use its 'tool' to help determine the degree of score urgency via color-coding; low(Cyan), medium(Purple), high(Orange Flicker).
- Coverage Overlap Alert: The app detects and flags when the system determines two PEs in the same location (Mbare Ward 3) track the same UIN.

## Style Guidelines:

- Primary color: Deep sky blue (#43B5FF), a bright and energetic hue that promotes a sense of health, confidence, and community engagement, aligning with the app's goals.
- Background color: Light-sky-blue (#D2EAFF) for a clean, modern look and a soothing user experience, suitable for extended use.
- Accent color: Violet (#8A2BE2) provides contrast to the primary and helps in creating visual interest.
- Body and headline font: 'Inter', a sans-serif font, is recommended because its objective and neutral look creates a professional feel.
- Use clear, consistent icons to represent services, risk levels, and data categories. The style is to be modern and simple to ensure usability.
- Design a responsive layout with a clear information hierarchy to accommodate various screen sizes and devices used by CHMs and PEs. Favor simple, modular layouts.
- Use subtle animations and transitions to guide users through workflows, indicate system activity (like syncing data), and reinforce engagement, while keeping it streamlined for field use.