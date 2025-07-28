React-based e-commerce frontend application called "GlobalShopper" built with modern web technologies. Key characteristics:

**Tech Stack:**
- React 19.1.0 with Vite as build tool
- Redux Toolkit for state management with Redux Persist
- React Router DOM for routing
- Tailwind CSS for styling
- Radix UI components for accessible UI elements
- Formik + Yup for form handling and validation

**Project Structure:**
- `/src/components` - Reusable UI components (Footer, Header, Sidebars, etc.)
- `/src/containers` - Page-level components organized by feature (Admin, Auth, CustomerCenter, Home, Wallet)
- `/src/routes` - Routing configuration
- `/src/redux` & `/src/store` - State management
- `/src/services` - API services
- `/src/utils` - Utility functions

**Main Features:**
- Authentication system (Login, Signup, OTP verification, Password reset)
- Customer account center with purchase requests, quotes, orders, refunds
- Admin panel for managing purchase requests
- Wallet system for deposits and balance management
- Multi-role based routing (Customer vs Admin)

**Key Pages:**
- Homepage with product browsing
- Customer dashboard for managing requests and orders
- Admin panel for request management
- Wallet management system
