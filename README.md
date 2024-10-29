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

You can access the live version of the app [here]({https://eldertasks.vercel.app/}).

## Demo Videos

Below are links to demo videos showcasing different features of the app:

1. **Adding and Managing Tasks**  
   [Video Link](https://www.loom.com/share/6f7b4ffdc79f41779eca6b9386db412f?sid=acc8a46b-12a8-4565-b96a-a7e084c713ac)

2. **Marking Tasks as Completed and Sorting**  
   [Video Link](https://www.loom.com/share/52a55c638af747f49b14e0e6d8675aaf?sid=38bdfaad-90a9-4970-b146-1ba049822019)

3. **Suggested Tasks and Family Management**  
   [Video Link](https://www.loom.com/share/a844ecfd29fc4a76be418f469ae6e664?sid=3bd6f76a-d10c-4619-85fa-3ee0625c6807)


## Setup Instructions

Follow these steps to set up the application locally. 

### Prerequisites

Ensure you have the following installed:
- Node.js and npm
- Firebase CLI (for deploying changes to Firebase Hosting)

### Frontend Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/Snake9211/eldertasks.git
   cd eldertasks
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

