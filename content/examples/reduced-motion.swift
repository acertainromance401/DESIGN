import SwiftUI

struct ReducedMotionExample: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var expanded = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Button(expanded ? "Hide details" : "Show details") {
                withAnimation(reduceMotion ? nil : .easeInOut(duration: 0.2)) {
                    expanded.toggle()
                }
            }
            if expanded {
                Text("Details remain available with or without animation.")
                    .fixedSize(horizontal: false, vertical: true)
                    .transition(reduceMotion ? .identity : .opacity)
            }
        }
        .padding()
    }
}
