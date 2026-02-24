# StoryDeck AI 🚀

StoryDeck AI is a powerful, AI-driven presentation platform that allows users to generate professional-quality slide decks in seconds. By leveraging advanced language models and a flexible design system, StoryDeck AI transforms simple prompts into structured, visually appealing presentations.

## ✨ Key Features

- **AI-Powered Slide Generation**: Generate complete presentation structures and content from a single prompt using OpenAI or Google Gemini.
- **Brand Identity Vault**: Maintain consistent branding with global assets including logos, color palettes, and typography.
- **Dynamic Layout Patterns**: Support for various slide types like Timeline, Comparison, Quote, and Call-to-Action.
- **PowerPoint Export**: Seamlessly export your AI-generated decks to `.pptx` files for offline use.
- **Interactive Editor**: Fine-tune your slides with a drag-and-drop interface and real-time editing.
- **Secure Authentication**: Integrated with Supabase Auth for robust user management.
- **Subscription & Payments**: Monetized via Stripe for premium feature access.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://reactjs.org/)
- **Backend & Database**: [Supabase](https://supabase.com/)
- **AI Integration**: [OpenAI API](https://openai.com/) & [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Payments**: [Stripe](https://stripe.com/)
- **Export Engine**: [PptxGenJS](https://gitbrent.github.io/PptxGenJS/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Supabase project
- API keys for OpenAI/Gemini and Stripe

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/storydeck-ai.git
   cd storydeck-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your credentials (refer to `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `/src/app`: Next.js App Router pages and layouts.
- `/src/components`: Reusable UI components.
- `/src/actions`: Server actions for data mutations.
- `/src/lib`: Utility functions and shared library configurations.
- `/src/hooks`: Custom React hooks.
- `/src/store`: Zustand state management stores.
- `/supabase-schema.sql`: Database schema for Supabase setup.

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

Built with ❤️ by the StoryDeck AI Team.
