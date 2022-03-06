# steak-counter-ts

This is a basic streak counter - inspired by Duolingo's style - written in TypeScript and meant for the browser (uses `localStorage`).

## Install

```shell
yarn add @petercr/streak-counter-ts
```

```shell
npm install @petercr/streak-counter-ts
```

### Usage

```typescript
import { streakCounter } from "@petercr/streak-counter-ts";

const today = new Date();

const streak = streakCounter(localStorage, today);

// streak returns an object:
// {
//    currentCount: 1,
//    lastLoginDate: "11/11/2021",
//    startDate: "11/11/2021",
// }
```
