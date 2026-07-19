import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repoFile = (path) => new URL(`../../${path}`, import.meta.url);

test("Filter Lab long press exports only the rendered local preview with add-only Photos access", async () => {
  const [previewView, resultView, filterLabView, viewModel, saver] = await Promise.all([
    readFile(repoFile("ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterPreviewView.swift"), "utf8"),
    readFile(repoFile("ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterResultView.swift"), "utf8"),
    readFile(repoFile("ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabView.swift"), "utf8"),
    readFile(repoFile("ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabViewModel.swift"), "utf8"),
    readFile(repoFile("ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabPhotoLibrarySaver.swift"), "utf8")
  ]);

  assert.match(previewView, /onLongPressGesture\(minimumDuration: 0\.6/);
  assert.match(previewView, /afterImage != nil && !isRendering && !isSaving/);
  assert.match(previewView, /filter_lab\.action\.save_filtered/);
  assert.match(resultView, /onSaveAfterImage: onSaveFilteredPreview/);
  assert.match(filterLabView, /saveFilteredPreviewToPhotoLibrary/);
  assert.match(viewModel, /photoLibrarySaver\.save\(previewImage\)/);
  assert.doesNotMatch(viewModel, /photoLibrarySaver\.save\(styleReferenceImage\)/);
  assert.doesNotMatch(viewModel, /photoLibrarySaver\.save\(applyTargetImage\)/);
  assert.match(saver, /authorizationStatus\(for: \.addOnly\)/);
  assert.match(saver, /requestAuthorization\(for: \.addOnly\)/);
  assert.match(saver, /PHAssetChangeRequest\.creationRequestForAsset\(from: image\)/);
  assert.doesNotMatch(saver, /URLSession|URLRequest|api\.siliconflow|Bearer /i);
});

test("Filter Lab export has localized guidance and add-only usage descriptions in both build configurations", async () => {
  const [english, traditionalChinese, project] = await Promise.all([
    readFile(repoFile("ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings"), "utf8"),
    readFile(repoFile("ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings"), "utf8"),
    readFile(repoFile("ios-app/AIPhotoApp.xcodeproj/project.pbxproj"), "utf8")
  ]);

  const requiredKeys = [
    "filter_lab.preview.save_hint",
    "filter_lab.action.save_filtered",
    "filter_lab.export.saving",
    "filter_lab.export.saved",
    "filter_lab.export.denied",
    "filter_lab.export.failed"
  ];

  for (const key of requiredKeys) {
    assert.equal(english.includes(`\"${key}\"`), true);
    assert.equal(traditionalChinese.includes(`\"${key}\"`), true);
  }

  assert.equal((project.match(/INFOPLIST_KEY_NSPhotoLibraryAddUsageDescription/g) ?? []).length, 2);
});
