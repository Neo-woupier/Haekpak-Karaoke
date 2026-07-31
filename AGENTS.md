# Agent Brief: Haekpak Karaoke Web Booking System (Simulation)

## 📌 Project Overview
A web-based room booking application for **"Haekpak Karaoke"**. This is a simulated project designed to provide an intuitive, responsive, and seamless booking experience for customers across various devices.

---

## 🛠️ Tech Stack & Requirements
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js (API Services for Room & Schedule Data)
- **UI/UX Focus:** Mobile-first design, highly responsive layout, dynamic GIF background, and loading states.

---

## 🎨 Frontend Architecture & Specifications

### 1. Global Visual Theme
- **Background:** Dynamic background using a downloaded GIF asset.
- **Responsiveness:** Mobile-first approach. UI components must scale smoothly across smartphones, tablets, and desktop screens.

### 2. Main Page: Interactive Schedule Grid
- **Time Slots (Header/Columns):**
  - 1-hour duration per block.
  - 30-minute incremental intervals.
  - Operating hours start from **13:30 onwards**.
- **Room Types (Rows):**
  - **Rooms 1 - 3:** Small Rooms (Capacity: Max 7 people)
  - **Rooms 4 - 5:** Large Rooms (Capacity: Max 12 people)
- **Time Slot Visual States:**
  - **Booked Slot:** Dark/Occupied color indicating it is taken.
  - **Past/Expired Slot:** Distinct greyed/darkened color indicating the time has passed and is unbookable.
  - **Available Slot:** Standard readable state, interactive during booking mode.

### 3. Interactive Booking Workflow
1. **Triggering Booking Mode:**
   - User clicks the **"Book Room" (จองห้อง)** button located at the top-right corner.
   - All **Available Slots** in the grid will start **blinking/glowing** to invite user interaction.
2. **Selection & Confirmation:**
   - User ticks/selects desired room slot(s).
   - User clicks **"Confirm Selection"** to proceed.
3. **Checkout / Deposit Page:**
   - Redirects user to a confirmation form.
   - Form Fields: **Customer Name** and **Phone Number**.
   - Payment Integration: Displays a **QR Code for a 50% deposit payment**.

---

## ⚙️ Backend & Data Fetching Requirements

1. **Initial Data Load:**
   - On page load, immediately call the Backend API to fetch real-time room availability and schedule status.
2. **UX Enhancement (Loading State):**
   - Implement a **Skeleton Screen UI** while waiting for the API response to prevent layout shifts and provide feedback for slower network connections.