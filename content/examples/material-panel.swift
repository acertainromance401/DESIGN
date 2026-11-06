import SwiftUI

struct MaterialPanelExample: View {
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Workspace").font(.headline)
            Text("A material panel with an opaque accessibility alternative.")
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding()
        .background {
            if reduceTransparency {
                RoundedRectangle(cornerRadius: 16).fill(.background)
            } else {
                RoundedRectangle(cornerRadius: 16).fill(.regularMaterial)
            }
        }
        .overlay {
            RoundedRectangle(cornerRadius: 16).stroke(.primary.opacity(0.5), lineWidth: 1)
        }
        .padding()
    }
}
