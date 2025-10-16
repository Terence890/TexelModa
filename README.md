# Texel Moda - Virtual Try-On E-commerce Platform

Texel Moda is a fashion e-commerce website featuring virtual try-on capabilities built with React, Tailwind CSS, and Framer Motion.

## Features

- Modern responsive UI design
- Product browsing and filtering
- Virtual try-on functionality powered by Texel.Moda's Try-On Diffusion API
- Shopping cart functionality
- Smooth animations and transitions using Framer Motion

## Virtual Try-On Integration

The platform integrates with the **Virtual Try-On Diffusion [VTON-D]** technology by Texel.Moda through their RapidAPI service:

- Users can upload their photos and try on different clothing items
- Advanced options include text prompts for avatar, clothing, and background
- Background replacement options
- Image generation with seed control for consistent results

### How It Works

1. Users upload their avatar photo or use a text prompt to generate an avatar
2. Users select clothing items or provide text descriptions
3. Optional background customization
4. The API generates a realistic composite image showing the clothing on the user

## Project Structure

- `/src`: React source files
  - `/components`: Reusable UI components
    - `/layout`: Layout components (Header, Footer)
    - `/product`: Product-related components
    - `/try-on`: Try-on related components
  - `/pages`: Application pages
  - `/api`: API service functions for external services
  - `/utils`: Utility functions

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd texel-moda

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

- `REACT_APP_API_URL`: The base URL for the Try-On API
- `REACT_APP_API_KEY`: API key for the Try-On Diffusion service

## Credits

- Try-On Diffusion API by [Texel.Moda](https://texelmoda.com/)
- UI components built with Tailwind CSS
- Animations powered by Framer Motion
- Dilan
