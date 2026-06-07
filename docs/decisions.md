# Decisions

This file records important product and technical decisions.

## Decision 001 - iOS-first MVP

Status: Accepted

The MVP will target iOS first. Android and cross-platform expansion are future considerations.

## Decision 002 - Swift + SwiftUI

Status: Accepted

The iOS app will use Swift + SwiftUI. Native iOS frameworks are preferred because this is a camera-heavy and image-processing-heavy app.

## Decision 003 - Firebase-first backend

Status: Accepted

The MVP backend will use Firebase Auth, Firestore, Firebase Storage, Cloud Functions v2, Remote Config, and App Check.

## Decision 004 - Cloud Functions AI proxy

Status: Accepted

The iOS app must not call Gemini or OpenAI directly with client-side API keys. AI calls go through Cloud Functions server-side proxy and provider adapter.

## Decision 005 - Gemini for MVP photo analysis

Status: Accepted

The MVP default AI analysis provider is Gemini paid tier / GeminiAnalyzer for single-photo analysis and short advice.

## Decision 006 - OpenAI image/edit as future adapter

Status: Accepted

OpenAI image/edit integration is not required for MVP. Only adapter placeholders may be added when appropriate.

## Decision 007 - No true real-time cloud video AI in MVP

Status: Accepted

MVP will not stream camera frames to cloud AI in real time. Local Vision may be used for lightweight guidance. Cloud AI analyzes single photos after capture.

## Decision 008 - StoreKit 2 for MVP subscription

Status: Accepted

The MVP uses StoreKit 2 + StoreKit views. RevenueCat may be reconsidered later but is not the default.

## Decision 009 - No default model training consent

Status: Accepted

User photos should not be assumed to be used for model training. Any future training or model improvement usage must be separate, opt-in, revocable, and auditable.

## Decision 010 - No personalized ads SDK in MVP

Status: Accepted

The MVP will not include personalized ads SDKs. "No ads" can remain a future VIP benefit but should not add privacy complexity during MVP.
