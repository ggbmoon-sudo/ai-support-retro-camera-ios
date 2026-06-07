import SwiftUI

#if canImport(UIKit)
import UIKit
#endif

enum AppColors {
    static let accent = Color(red: 0.78, green: 0.54, blue: 0.30)
    static let filmGreen = Color(red: 0.55, green: 0.62, blue: 0.52)
    static let success = Color(red: 0.48, green: 0.69, blue: 0.49)
    static let warning = Color(red: 0.84, green: 0.66, blue: 0.36)
    static let error = Color(red: 0.89, green: 0.42, blue: 0.36)

    static var background: Color {
        dynamicColor(dark: (0.05, 0.05, 0.04), light: (0.96, 0.94, 0.90))
    }

    static var surface: Color {
        dynamicColor(dark: (0.08, 0.07, 0.06), light: (1.00, 0.98, 0.94))
    }

    static var elevatedSurface: Color {
        dynamicColor(dark: (0.13, 0.11, 0.09), light: (0.91, 0.88, 0.82))
    }

    static var textPrimary: Color {
        dynamicColor(dark: (0.96, 0.95, 0.92), light: (0.08, 0.07, 0.06))
    }

    static var textSecondary: Color {
        dynamicColor(dark: (0.72, 0.68, 0.64), light: (0.35, 0.32, 0.29))
    }

    private static func dynamicColor(
        dark: (Double, Double, Double),
        light: (Double, Double, Double)
    ) -> Color {
        #if canImport(UIKit)
        return Color(uiColor: UIColor { traits in
            let rgb = traits.userInterfaceStyle == .dark ? dark : light
            return UIColor(red: rgb.0, green: rgb.1, blue: rgb.2, alpha: 1)
        })
        #else
        return Color(red: dark.0, green: dark.1, blue: dark.2)
        #endif
    }
}
