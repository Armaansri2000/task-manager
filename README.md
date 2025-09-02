A responsive task management web app built with React + Redux Toolkit, featuring role-based access, task CRUD, and pagination.
The app uses localStorage as a mock backend API for development and testing. 

 Features----
Responsive Web UI: Works across devices and modern browsers.

Authentication:

Basic login with session handling.

Role-based access control (admin, manager, user).

User Management:

Create new users.

List all registered users.

Task Management:

Create, update, and delete tasks.

Assign tasks to users (restricted by role).

Newly created tasks always appear at the top.

Task Listing:

Paginated view for performance and usability.

API Integration:

Local mock REST API powered by localStorage.


Tech Stack----

Frontend: React (Vite)

State Management: Redux Toolkit

UI Library: TailwindCSS + ShadCN UI

Routing: React Router

Storage: localStorage (mock backend)

 Installation & Setup----
Clone or unzip the project:

cd task-manager-assignment


Install dependencies:

npm install


Start development server:

npm run dev


Open in browser:

http://localhost:

 Default Users--

By default, you can log in with these accounts:

Role	Username	Password
Admin	admin	admin123
User	user	user123

Admins can create users and assign tasks. Regular users can only manage their own tasks.

 
 Notes---
Data persists in localStorage.
To reset, open DevTools → Application → Local Storage → clear keys starting with tm_.

