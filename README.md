# Family Task Manager

A web application to help families organize and manage their tasks efficiently. Users can add new tasks, view upcoming tasks, mark tasks as complete, and handle suggested tasks. The application leverages Firebase for backend services and React with TypeScript for the frontend.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Live Demo](#live-demo)
- [Demo Videos](#demo-videos)
- [Setup Instructions](#setup-instructions)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Recommendations](#recommendations)
- [Contact Information](#contact-information)

## Features

- Add and manage tasks for family members.
- View details for recent and upcoming tasks.
- Mark tasks as completed or delete them.
- Sort tasks by date created or status.
- Suggested tasks feature allows families to see recommended tasks.
- Real-time data synchronization using Firebase.

## Technologies Used

- **Frontend**: React, TypeScript, Material UI
- **Backend**: Firebase Firestore, Firebase Authentication
- **Hosting**: Firebase Hosting

## Live Demo

You can access the live version of the app [here]({link}).

## Demo Videos

Below are links to demo videos showcasing different features of the app:

1. **Adding and Managing Tasks**  
   [Video Link](https://www.youtube.com/watch?v=VIDEO_ID_1)

2. **Marking Tasks as Completed and Sorting**  
   [Video Link](https://www.youtube.com/watch?v=VIDEO_ID_2)

3. **Suggested Tasks and Family Management**  
   [Video Link](https://www.youtube.com/watch?v=VIDEO_ID_3)

> **Note**: Replace VIDEO_ID_X with the actual video IDs from your hosting platform.

## Setup Instructions

Follow these steps to set up the application locally. 

### Prerequisites

Ensure you have the following installed:
- Node.js and npm
- Firebase CLI (for deploying changes to Firebase Hosting)

### Frontend Setup

1. Clone this repository:
   ```bash
   git clone <Snake9211/eldertasks>
   cd <../eldertasks>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Running the Application

After setting up the frontend, you can begin testing and using the application locally. You can also deploy updates to Firebase Hosting if the Firebase CLI is configured correctly.

### Project Structure

```plaintext
.
├── public              # Public assets and files
├── src
│   ├── components      # React components
│   ├── context         # Context API for managing global state
│   ├── pages           # Page components for different routes
│   ├── services        # Firebase and other service integrations
│   └── types           # TypeScript types
└── README.md
```

## Recommendations

Some features that could further enhance the Family Task Manager:

1. **Referral System**  
   A system to allow users to refer others to the app and get rewards or additional features when they sign up.

2. **Shared Calendar View**  
   Adding a shared calendar view for the family to see upcoming tasks in a calendar format.

3. **Automated Reminders**  
   Set reminders for tasks so family members get notifications when a task is due.

4. **Reward System for Completed Tasks**  
   Introduce a reward or point system to encourage task completion among family members.

5. **User Feedback and Rating**  
   Allow family members to rate tasks or give feedback on the app, helping in continuous improvement.

## Contact Information

For any questions or feedback, please feel free to reach out at [tiwarin9211@gmail.com].

