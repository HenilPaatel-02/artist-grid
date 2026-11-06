# 🎨 ArtistGrid

**A Drawing Reference Toolkit for Artists**

ArtistGrid is a React Native mobile application designed to help artists create accurate drawings using reference images, customizable grids, and adjustable drawing surfaces.

Prepare your reference image, configure your paper size, customize grid lines, adjust image effects, and export your drawing reference — all in one place.

---

## ✨ Features

### 🖼️ Reference Image

- Select reference images from your device gallery.
- Preview selected images.
- View image resolution and orientation.
- Replace or remove selected images.

### 📐 Drawing Surface

- Multiple paper size presets: A5, A4, A3, A2, and A1.
- Portrait and landscape orientation.
- Automatic drawing surface calculations.

### 🔲 Grid Configuration

- Configure custom row and column counts.
- Automatic grid calculations.
- Accurate grid proportions.
- Dynamic grid preview.

### 🎨 Image Effects

- Brightness adjustment.
- Contrast adjustment.
- Saturation adjustment.
- Grayscale effect.
- Image opacity control.
- Reset effects to default values.

### 🖌️ Grid Styling

- Toggle grid visibility.
- Toggle row and column labels.
- Customize grid color.
- Adjust grid opacity.
- Customize grid line thickness.
- Customize label size and color.

### 💾 Project Management

- Create and save drawing projects.
- Reopen and edit saved projects.
- Automatically save unfinished work.
- Recover drafts after leaving the editor.
- Permanently discard drafts.
- View recent projects.
- Delete projects with confirmation.
- Persist project images locally.

### 📤 Export & Sharing

- Export drawing previews as PNG.
- Choose image-grid, image-only, and grid-only export modes.
- Configure export background and resolution.
- Save previews to the device gallery.
- Share exported previews.

---

## 🛠️ Tech Stack

| Technology         | Purpose                             |
| ------------------ | ----------------------------------- |
| React Native       | Cross-platform mobile development   |
| Expo SDK 54        | Development and native tooling      |
| TypeScript         | Type safety                         |
| Expo Router        | File-based navigation               |
| React Native Skia  | High-performance grid rendering     |
| AsyncStorage       | Local project and draft persistence |
| Expo Image Picker  | Reference image selection           |
| Expo Media Library | Gallery access and image saving     |
| Expo Sharing       | Share exported images               |
| Jest               | Unit testing                        |

---

## 📁 Project Architecture

ArtistGrid follows a feature-based architecture to keep application logic modular, maintainable, and scalable.

```text
ArtistGrid/
│
├── app/
│   ├── index.tsx
│   ├── new-project.tsx
│   └── projects.tsx
│
├── src/
│   ├── constants/
│   │
│   └── features/
│       ├── drawing-surface/
│       ├── export/
│       ├── grid/
│       ├── image-effects/
│       ├── image-orientation/
│       ├── image-picker/
│       └── project/
│
├── assets/
│   └── images/
│
├── app.json
├── eas.json
├── package.json
└── tsconfig.json
```

Each feature contains its own components, utilities, types, and business logic where applicable.

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Android Studio or an Android device
- Expo account for EAS development builds

### 1. Clone the repository

```bash
git clone https://github.com/HenilPaatel-02/artist-grid.git
```

### 2. Navigate to the project

```bash
cd artist-grid
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the Expo development server

```bash
npx expo start
```

For a development build:

```bash
npx expo start --dev-client
```

### 5. Build for Android

Install the development client:

```bash
npx expo install expo-dev-client
```

Configure EAS:

```bash
npx eas-cli build:configure
```

Build the Android development APK:

```bash
npx eas-cli build --platform android --profile development
```

---

## 🧪 Code Quality & Testing

ArtistGrid has passed the following automated checks:

| Quality Check    | Result              |
| ---------------- | ------------------- |
| Expo Doctor      | 18/18 checks passed |
| TypeScript       | Passed              |
| Jest Test Suites | 13 passed           |
| Jest Tests       | 79 passed           |

Run the checks locally:

```bash
npx expo-doctor
```

```bash
npx tsc --noEmit
```

```bash
npm test -- --runInBand
```

---

## 🗺️ Development Roadmap

- [x] Image picker integration
- [x] Paper size and orientation engine
- [x] Grid calculation engine
- [x] Skia-based grid rendering
- [x] Image effects
- [x] Grid styling
- [x] Project persistence
- [x] Draft autosave and recovery
- [x] Project management
- [x] PNG export implementation
- [x] Image sharing
- [x] Verify PNG export on Android development build
- [x] Verify gallery saving on Android development build
- [x] Release production build

---

## 🎯 Project Goal

The goal of ArtistGrid is to simplify the traditional grid method of drawing by providing artists with a digital toolkit for preparing reference images and creating accurate drawing proportions.

Whether you're a beginner learning the grid method or an experienced artist working on detailed portraits, ArtistGrid aims to make your drawing workflow easier and more organized.

---

## 👨‍💻 Developer

**Henil Patel**

Full Stack Developer | React Native Developer

- GitHub: [@HenilPaatel-02](https://github.com/HenilPaatel-02)

---

## 📄 License

This project is currently provided for educational and portfolio purposes. A formal open-source license can be added when selected.
