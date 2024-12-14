# HuiputinPäiväkirja

Group 3 mobile application project.

## Project Overview

This is a mobile application built using React Native and Google Firebase services. The application is a bouldering tracking tool tailored currently for a single local climbing hall at OKK (Oulun kiipeilykeskus; Oulu climbing centre). It allows users to log and track their climbs, create and manage climbing routes, and engage with other users through voting and content management.

## Features
+ User Authentication: Login and account creation via Firebase.
+ Interactive Map View: Displays the climbing hall map with route markers.
+ Two-colored markers indicate route tags and hold colors.
+ Route Screen:
  + View details (image, grade, etc.).
  + Mark routes as climbed.
  + Vote for grades and route deletions.
+ Route Creation:
  + Define the marker location on the map.
  + Upload a route image and draw the climbing path.
  + Assign name, tags, and hold colors.
+ User Profile:
  + Add additional information about yourself.
+ Boulder History:
  + List all climbed routes and track your progress

## Tech stack
+ Frontend Framework: React Native (Expo Managed Workflow)
+ Development Environment: Expo Go for testing and debugging
+ Backend: Firebase (Authentication, Firestore, Cloud Storage)
+ Build Tool: Expo’s online build service for generating release APKs
+ Boulder map: React Native ReAnimated, React Native Gesture Handler and SVG
+ Camera library: Expo Camera
+ Image Editing: SVG for custom drawing component in route creation

## Installation & Setup for local testing and reviewing

### Prerequisites:
+ Node.js and npm installed
+ Expo CLI (npm install -g expo-cli)
+ Firebase project set up and configured (Cloud Firestore, Authentication and Cloud Storage)

### Steps:
1. Clone the repository:
  + bash:
    > *git clone https://github.com/HuipuntinPaivakirja/HuiputinPaivakirja.git*
    
    > *cd HuiputinPaivakirja*
2. Install dependencies:
  + bash
    > *npm install*
3. Set up Firebase:
  + Create a Firebase project.
  + Enable Authentication, Firestore, and Storage.
  + Add your Firebase configuration file to the project root.
4. Start the application:
  + bash
    > *npx expo start*
5. Open the app on your device using Expo Go or an emulator.

## How to Use

### User Actions
+ Login/Sign Up: Create an account or log in with existing credentials.
+ Map Interaction:
  + Tap markers to view route details.
  + Add a marker to start creating a new route.
+ Route Management:
  + Climb a route and mark it as completed.
  + Vote on grades or suggest deletions.
+ Profile & History:
  + Add personal information.
  + View your climbing history.
+ Appearance:
  + Switch themes in settings
 
## Development Team

- Pasi Puhakka:	Project Manager/Software developer
> Image editing and user profile

-	Joonas Salmela: Software developer
> Authentication, theming and navigation
 
- Nico Hertolin: Software Developer
> Route creation and user interaction

- Juho Hietala: Software Developer
> Gesture Handling and UI/UX

## App Structure
Folders:

/assets – Static assets like icons, images, etc.

/src

/components – Reusable React Native components.

/context - Context providers

/firebase – Firebase configuration and API calls.

/Helpers - Helper functions and objects

/navigation - Drawer navigation stacks

/screens - Individual screens (eq. Map, Boulder and Profile screens)

/styles - Application stylesheets

/theme - Theme provider and custom theme

## Future Enhancements

+ Social Features: Allow users to follow each other and share climbing progress.
+ Leaderboard: Track and rank climbers within the hall.
+ Multihall Support: Expand to support multiple climbing gyms.

## License

This software is proprietary and owned by Boulder Brothers Club. Unauthorized copying, distribution, or modification is strictly prohibited. For inquiries regarding licensing, please contact the development team.

## Acknowledgments

Special thanks to:

The climbing community for inspiration.
Firebase and React Native documentation for technical guidance.
The entire development team for continuous efforts in building and upgrading the software
